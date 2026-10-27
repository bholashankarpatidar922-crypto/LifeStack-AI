from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class IngestPreviewRequest(BaseModel):
    domain: str  # spending, health, academics, career
    file_content: str  # raw text or base64
    filename: str

class ColumnMapping(BaseModel):
    detected_column: str
    target_field: str
    confidence: float

class IngestValidationReport(BaseModel):
    batch_id: str
    domain: str
    total_rows: int
    valid_rows: int
    invalid_rows: int
    detected_columns: List[str]
    column_mappings: List[ColumnMapping]
    sample_records: List[Dict[str, Any]]
    validation_errors: List[str]

class IngestCommitRequest(BaseModel):
    batch_id: str
    domain: str
    records: List[Dict[str, Any]]

class IngestHistoryItem(BaseModel):
    batch_id: str
    domain: str
    filename: str
    rows_imported: int
    imported_at: datetime
    can_rollback: bool
