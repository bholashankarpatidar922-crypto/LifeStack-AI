from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from apps.api.core.database import get_db
from apps.api.core.deps import get_current_user
from apps.api.models.dimensions import DimUser
from apps.api.models.facts import FactGoalProgress

router = APIRouter(prefix="/api/goals", tags=["Goal Planner"])

class GoalCreateRequest(BaseModel):
    domain: str
    title: str
    description: Optional[str] = None
    target_amount_or_metric: float
    current_amount_or_metric: float = 0.0
    target_date: date
    monthly_savings_allocated: float = 0.0

class GoalUpdateRequest(BaseModel):
    current_amount_or_metric: Optional[float] = None
    status: Optional[str] = None
    monthly_savings_allocated: Optional[float] = None

@router.get("/")
async def list_goals(current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(FactGoalProgress).where(FactGoalProgress.user_id == current_user.user_id).order_by(FactGoalProgress.target_date.asc())
    res = await db.execute(stmt)
    goals = res.scalars().all()
    return [
        {
            "goal_id": g.goal_id,
            "domain": g.domain,
            "title": g.title,
            "description": g.description,
            "target_amount_or_metric": g.target_amount_or_metric,
            "current_amount_or_metric": g.current_amount_or_metric,
            "target_date": g.target_date.isoformat(),
            "progress_pct": g.progress_pct,
            "status": g.status,
            "monthly_savings_allocated": g.monthly_savings_allocated
        } for g in goals
    ]

@router.post("/")
async def create_goal(req: GoalCreateRequest, current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    pct = round(min(100.0, (req.current_amount_or_metric / max(1.0, req.target_amount_or_metric)) * 100.0), 1)
    new_g = FactGoalProgress(
        user_id=current_user.user_id,
        domain=req.domain,
        title=req.title,
        description=req.description,
        target_amount_or_metric=req.target_amount_or_metric,
        current_amount_or_metric=req.current_amount_or_metric,
        target_date=req.target_date,
        progress_pct=pct,
        status="achieved" if pct >= 100 else "in_progress",
        monthly_savings_allocated=req.monthly_savings_allocated
    )
    db.add(new_g)
    await db.commit()
    return {"status": "success", "goal_id": new_g.goal_id}

@router.patch("/{goal_id}")
async def update_goal(goal_id: str, req: GoalUpdateRequest, current_user: DimUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    g = await db.get(FactGoalProgress, goal_id)
    if not g or g.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    if req.current_amount_or_metric is not None:
        g.current_amount_or_metric = req.current_amount_or_metric
        g.progress_pct = round(min(100.0, (g.current_amount_or_metric / max(1.0, g.target_amount_or_metric)) * 100.0), 1)
        if g.progress_pct >= 100:
            g.status = "achieved"
    if req.status is not None:
        g.status = req.status
    if req.monthly_savings_allocated is not None:
        g.monthly_savings_allocated = req.monthly_savings_allocated

    await db.commit()
    return {"status": "success", "progress_pct": g.progress_pct, "status_label": g.status}
