from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
import io
import csv
import pandas as pd
from typing import List, Dict, Any

from apps.api.core.database import get_db
from apps.api.core.deps import get_current_user
from apps.api.models.dimensions import DimUser
from apps.api.schemas.ingest import IngestValidationReport, IngestCommitRequest, ColumnMapping
from pipelines.etl_engine import stage_bronze, transform_silver_spending, load_gold_spending, rollback_gold_batch

router = APIRouter(prefix="/api/ingest", tags=["Data Ingestion & ETL"])

@router.post("/preview", response_model=IngestValidationReport)
async def preview_upload(
    file: UploadFile = File(...),
    domain: str = Form("spending"),
    current_user: DimUser = Depends(get_current_user)
):
    """
    Bronze & Silver Preview: Ingests file into Bronze staging, runs schema detection,
    and returns a validation report with sample rows before committing to Gold.
    """
    contents = await file.read()
    text_content = contents.decode("utf-8", errors="replace")

    # Stage raw payload in Bronze
    batch_id = stage_bronze(current_user.user_id, domain, file.filename, text_content)

    # Read with pandas
    try:
        df = pd.read_csv(io.StringIO(text_content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV format: {str(e)}")

    columns = list(df.columns)
    raw_dicts = df.head(100).to_dict(orient="records")

    # Column mappings
    mappings = []
    for c in columns:
        clow = c.lower()
        target = "unmapped"
        conf = 0.5
        if any(k in clow for k in ["date", "time", "txn"]):
            target = "date"
            conf = 0.95
        elif any(k in clow for k in ["amount", "debit", "cost", "price", "val"]):
            target = "amount"
            conf = 0.95
        elif any(k in clow for k in ["merchant", "narration", "desc", "payee", "to"]):
            target = "merchant"
            conf = 0.90
        elif "cat" in clow:
            target = "category"
            conf = 0.85
        mappings.append(ColumnMapping(detected_column=c, target_field=target, confidence=conf))

    clean_records, errors = transform_silver_spending(raw_dicts)

    return IngestValidationReport(
        batch_id=batch_id,
        domain=domain,
        total_rows=len(df),
        valid_rows=len(clean_records),
        invalid_rows=len(errors),
        detected_columns=columns,
        column_mappings=mappings,
        sample_records=clean_records[:5],
        validation_errors=errors[:10]
    )

@router.post("/commit")
async def commit_ingest(
    req: IngestCommitRequest,
    current_user: DimUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Commits validated Silver records into the Gold Star Schema."""
    if req.domain == "spending":
        count = await load_gold_spending(db, current_user.user_id, req.batch_id, req.records)
        return {"status": "success", "message": f"Successfully loaded {count} records into Gold warehouse.", "batch_id": req.batch_id}
    return {"status": "error", "message": f"Domain {req.domain} handler not configured."}

@router.post("/rollback/{batch_id}")
async def rollback_ingest(
    batch_id: str,
    current_user: DimUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Rolls back an ingested batch from the Gold warehouse."""
    deleted_rows = await rollback_gold_batch(db, current_user.user_id, batch_id)
    return {"status": "success", "message": f"Rolled back batch {batch_id}. Removed {deleted_rows} records."}
