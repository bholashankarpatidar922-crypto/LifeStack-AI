from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from apps.api.core.database import get_db
from apps.api.core.deps import get_current_user
from apps.api.models.dimensions import DimUser
from apps.api.models.facts import FactDecision

router = APIRouter(prefix="/api/decisions", tags=["Decision Journal"])

class DecisionCreateRequest(BaseModel):
    category: str
    title: str
    details: str
    options_considered: List[str]
    chosen_option: str
    predicted_outcome: str
    confidence_score: float = 0.85
    review_scheduled_date: Optional[date] = None

class DecisionReviewRequest(BaseModel):
    actual_outcome: str
    outcome_score: float  # 1 to 10
    status: str  # validated, contradicted

@router.get("/")
async def list_decisions(current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(FactDecision).where(FactDecision.user_id == current_user.user_id).order_by(FactDecision.date.desc())
    res = await db.execute(stmt)
    decs = res.scalars().all()
    
    total = len(decs)
    validated = len([d for d in decs if d.status == "validated"])
    accuracy = round((validated / max(1, total)) * 100.0, 1) if total > 0 else 0.0

    return {
        "accuracy_rate_pct": accuracy,
        "total_logged": total,
        "validated_count": validated,
        "decisions": [
            {
                "decision_id": d.decision_id,
                "date": d.date.isoformat(),
                "category": d.category,
                "title": d.title,
                "details": d.details,
                "options_considered": d.options_considered,
                "chosen_option": d.chosen_option,
                "predicted_outcome": d.predicted_outcome,
                "confidence_score": d.confidence_score,
                "actual_outcome": d.actual_outcome,
                "outcome_score": d.outcome_score,
                "review_scheduled_date": d.review_scheduled_date.isoformat() if d.review_scheduled_date else None,
                "status": d.status
            } for d in decs
        ]
    }

@router.post("/")
async def create_decision(req: DecisionCreateRequest, current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    d = FactDecision(
        user_id=current_user.user_id,
        date=date.today(),
        category=req.category,
        title=req.title,
        details=req.details,
        options_considered=req.options_considered,
        chosen_option=req.chosen_option,
        predicted_outcome=req.predicted_outcome,
        confidence_score=req.confidence_score,
        review_scheduled_date=req.review_scheduled_date,
        status="pending_review"
    )
    db.add(d)
    await db.commit()
    return {"status": "success", "decision_id": d.decision_id}

@router.post("/{decision_id}/review")
async def review_decision(decision_id: str, req: DecisionReviewRequest, current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    d = await db.get(FactDecision, decision_id)
    if not d or d.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Decision record not found")
    
    d.actual_outcome = req.actual_outcome
    d.outcome_score = req.outcome_score
    d.status = req.status
    await db.commit()
    return {"status": "success", "message": "Decision review recorded and system calibration updated."}
