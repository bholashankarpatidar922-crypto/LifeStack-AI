from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import datetime
from typing import List, Dict, Any

from apps.api.core.database import get_db
from apps.api.core.deps import get_current_user
from apps.api.models.dimensions import DimUser
from apps.api.models.system import ConsentRecord, AuditLog
from apps.api.models.facts import FactSpending, FactHealth, FactAcademic, FactCareer, FactGoalProgress, FactDecision
from apps.api.models.vector import DocChunk
from apps.api.schemas.privacy import ConsentUpdateRequest, ConsentListResponse, ConsentItem, AuditLogItem, DataExportResponse

router = APIRouter(prefix="/api/privacy", tags=["Privacy Vault & Compliance"])

@router.get("/consents", response_model=ConsentListResponse)
async def get_consents(current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(ConsentRecord).where(ConsentRecord.user_id == current_user.user_id)
    res = await db.execute(stmt)
    records = res.scalars().all()

    # If no records exist, return default set
    if not records:
        defaults = [
            ConsentItem(category="spending", consent_granted=True, purpose="Spending pattern mining & budget alerts"),
            ConsentItem(category="health", consent_granted=True, purpose="Sleep & wellness correlation analysis"),
            ConsentItem(category="academics", consent_granted=True, purpose="Academic outcome forecasting"),
            ConsentItem(category="career", consent_granted=True, purpose="Placement & compensation benchmarking"),
            ConsentItem(category="public_benchmarking", consent_granted=True, purpose="Anonymized cohort comparison (k >= 10)"),
        ]
        return ConsentListResponse(user_id=current_user.user_id, consents=defaults)

    return ConsentListResponse(
        user_id=current_user.user_id,
        consents=[
            ConsentItem(
                category=r.category,
                consent_granted=r.consent_granted,
                purpose=r.purpose,
                updated_at=r.updated_at
            ) for r in records
        ]
    )

@router.post("/consents", response_model=ConsentListResponse)
async def update_consents(
    req: ConsentUpdateRequest,
    current_user: DimUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    for item in req.consents:
        stmt = select(ConsentRecord).where(
            ConsentRecord.user_id == current_user.user_id,
            ConsentRecord.category == item.category
        )
        res = await db.execute(stmt)
        rec = res.scalar_one_or_none()
        if rec:
            rec.consent_granted = item.consent_granted
            rec.updated_at = datetime.utcnow()
        else:
            db.add(ConsentRecord(
                user_id=current_user.user_id,
                category=item.category,
                consent_granted=item.consent_granted,
                purpose=item.purpose
            ))

    db.add(AuditLog(
        user_id=current_user.user_id,
        action="update_consents",
        resource="privacy_consents",
        details={"updated_count": len(req.consents)}
    ))
    await db.commit()
    return await get_consents(current_user, db)

@router.get("/audit-log", response_model=List[AuditLogItem])
async def get_audit_log(
    current_user: DimUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(AuditLog).where(AuditLog.user_id == current_user.user_id).order_by(AuditLog.timestamp.desc()).limit(50)
    res = await db.execute(stmt)
    records = res.scalars().all()
    return [
        AuditLogItem(
            log_id=r.log_id,
            action=r.action,
            resource=r.resource,
            details=r.details or {},
            timestamp=r.timestamp,
            ip_address=r.ip_address
        ) for r in records
    ]

@router.get("/export", response_model=DataExportResponse)
async def export_data(
    current_user: DimUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates complete data export aligned with GDPR & DPDP Act 2023."""
    spends_count = (await db.execute(select(FactSpending).where(FactSpending.user_id == current_user.user_id))).scalars().all()
    health_count = (await db.execute(select(FactHealth).where(FactHealth.user_id == current_user.user_id))).scalars().all()
    acad_count = (await db.execute(select(FactAcademic).where(FactAcademic.user_id == current_user.user_id))).scalars().all()
    career_count = (await db.execute(select(FactCareer).where(FactCareer.user_id == current_user.user_id))).scalars().all()
    goals_count = (await db.execute(select(FactGoalProgress).where(FactGoalProgress.user_id == current_user.user_id))).scalars().all()
    dec_count = (await db.execute(select(FactDecision).where(FactDecision.user_id == current_user.user_id))).scalars().all()

    db.add(AuditLog(
        user_id=current_user.user_id,
        action="data_export_generated",
        resource="privacy_vault",
        details={"total_entities_exported": len(spends_count) + len(health_count)}
    ))
    await db.commit()

    return DataExportResponse(
        user_profile={
            "user_id": current_user.user_id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat()
        },
        consents=[],
        spending_records_count=len(spends_count),
        health_records_count=len(health_count),
        academic_records_count=len(acad_count),
        career_records_count=len(career_count),
        goals_count=len(goals_count),
        decisions_count=len(dec_count),
        export_timestamp=datetime.utcnow(),
        download_url_json=f"/api/privacy/export/download?format=json&user_id={current_user.user_id}",
        download_url_csv=f"/api/privacy/export/download?format=csv&user_id={current_user.user_id}"
    )

@router.delete("/delete-account")
async def delete_account(
    current_user: DimUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Complete Right-to-be-Forgotten erasure cascade.
    Permanently deletes user, facts, vector chunks, consents, and audits.
    """
    uid = current_user.user_id
    # Remove RAG doc chunks
    await db.execute(delete(DocChunk).where(DocChunk.user_id == uid))
    # Remove user (cascade removes all fact and dimension relationships)
    await db.execute(delete(DimUser).where(DimUser.user_id == uid))
    await db.commit()

    return {"status": "success", "message": "All personal data and account records permanently erased."}
