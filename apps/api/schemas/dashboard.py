from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date, datetime

class LifeScoreBreakdown(BaseModel):
    composite_score: float  # 0 - 100
    financial_score: float   # 0 - 100
    career_score: float      # 0 - 100
    health_score: float      # 0 - 100
    academic_score: float    # 0 - 100
    weekly_delta: float      # e.g., +2.4
    status_label: str        # "Optimal Momentum", "Balanced", "Needs Attention"
    primary_driver: str      # e.g., "Emergency fund progress and high sleep consistency"

class KPICards(BaseModel):
    monthly_burn_rate: float
    savings_rate_pct: float
    avg_sleep_hours: float
    active_goals_count: int
    goals_on_track_count: int
    unreviewed_decisions_count: int
    anomalies_detected_30d: int

class SpendingCategorySlice(BaseModel):
    category_id: str
    category_name: str
    total_amount: float
    percentage: float
    is_essential: bool
    transaction_count: int

class TrendDataPoint(BaseModel):
    date: str
    spending: float
    sleep_hours: Optional[float] = None
    stress_score: Optional[float] = None
    savings_accumulated: Optional[float] = None

class DashboardSummaryResponse(BaseModel):
    life_score: LifeScoreBreakdown
    kpis: KPICards
    spending_breakdown: List[SpendingCategorySlice]
    trend_history_90d: List[TrendDataPoint]
    recent_anomalies: List[Dict[str, Any]]
    active_insights: List[Dict[str, Any]]
