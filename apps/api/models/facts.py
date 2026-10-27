import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base

class FactSpending(Base):
    __tablename__ = "fact_spending"

    spending_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    date_key = Column(Integer, ForeignKey("dim_time.date_key"), nullable=True)
    date = Column(Date, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    category_id = Column(String(50), ForeignKey("dim_category.category_id"), nullable=False, index=True)
    category_name = Column(String(100), nullable=False)
    merchant = Column(String(150), nullable=True)
    payment_method = Column(String(50), default="UPI")  # UPI, Credit Card, Debit Card, Cash, NetBanking
    source_id = Column(String(50), ForeignKey("dim_source.source_id"), nullable=True)
    is_anomaly = Column(Boolean, default=False)
    is_synthetic = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DimUser", back_populates="spendings")


class FactHealth(Base):
    __tablename__ = "fact_health"

    health_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    date_key = Column(Integer, ForeignKey("dim_time.date_key"), nullable=True)
    date = Column(Date, nullable=False, index=True)
    sleep_hours = Column(Float, nullable=False)
    steps = Column(Integer, nullable=False)
    heart_rate_avg = Column(Integer, nullable=True)
    stress_score = Column(Float, nullable=False)  # 0 to 100
    mood_score = Column(Float, nullable=False)    # 1 to 10
    water_liters = Column(Float, default=2.0)
    screen_time_hours = Column(Float, default=4.0)
    is_anomaly = Column(Boolean, default=False)
    is_synthetic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DimUser", back_populates="health_metrics")


class FactAcademic(Base):
    __tablename__ = "fact_academic"

    academic_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False)
    course_name = Column(String(150), nullable=False)
    course_code = Column(String(50), nullable=True)
    credits = Column(Integer, default=3)
    grade_point = Column(Float, nullable=False)  # 0 to 10.0 scale
    attendance_pct = Column(Float, nullable=False)  # 0 to 100
    study_hours_wk = Column(Float, default=10.0)
    is_synthetic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DimUser", back_populates="academics")


class FactCareer(Base):
    __tablename__ = "fact_career"

    career_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    role_title = Column(String(150), nullable=False)
    company_tier = Column(String(50), default="tier_2")  # tier_1, tier_2, startup, mid_size
    salary_inr = Column(Float, nullable=False)  # Annual CTC
    monthly_inhand = Column(Float, nullable=False)
    applications_sent = Column(Integer, default=0)
    interviews_count = Column(Integer, default=0)
    offers_count = Column(Integer, default=0)
    skills_acquired = Column(String(255), nullable=True)
    is_synthetic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DimUser", back_populates="career_milestones")


class FactGoalProgress(Base):
    __tablename__ = "fact_goal_progress"

    goal_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    domain = Column(String(50), nullable=False)  # finance, career, academic, health
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    target_amount_or_metric = Column(Float, nullable=False)
    current_amount_or_metric = Column(Float, default=0.0)
    target_date = Column(Date, nullable=False)
    progress_pct = Column(Float, default=0.0)
    status = Column(String(50), default="in_progress")  # in_progress, achieved, behind, abandoned
    monthly_savings_allocated = Column(Float, default=0.0)
    is_synthetic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DimUser", back_populates="goals")


class FactDecision(Base):
    __tablename__ = "fact_decision"

    decision_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    category = Column(String(50), nullable=False)  # career, finance, academic, lifestyle
    title = Column(String(200), nullable=False)
    details = Column(Text, nullable=False)
    options_considered = Column(JSON, default=list)
    chosen_option = Column(String(200), nullable=False)
    predicted_outcome = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.85)  # 0.0 to 1.0
    actual_outcome = Column(Text, nullable=True)
    outcome_score = Column(Float, nullable=True)     # Evaluated later 1-10
    review_scheduled_date = Column(Date, nullable=True)
    status = Column(String(50), default="pending_review")  # pending_review, validated, contradicted
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DimUser", back_populates="decisions")
