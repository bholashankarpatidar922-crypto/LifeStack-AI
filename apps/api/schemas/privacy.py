from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ConsentItem(BaseModel):
    category: str
    consent_granted: bool
    purpose: str
    updated_at: Optional[datetime] = None

class ConsentUpdateRequest(BaseModel):
    consents: List[ConsentItem]

class ConsentListResponse(BaseModel):
    user_id: str
    consents: List[ConsentItem]

class AuditLogItem(BaseModel):
    log_id: str
    action: str
    resource: str
    details: Dict[str, Any]
    timestamp: datetime
    ip_address: Optional[str] = None

class DataExportResponse(BaseModel):
    user_profile: Dict[str, Any]
    consents: List[Dict[str, Any]]
    spending_records_count: int
    health_records_count: int
    academic_records_count: int
    career_records_count: int
    goals_count: int
    decisions_count: int
    export_timestamp: datetime
    download_url_json: str
    download_url_csv: str
