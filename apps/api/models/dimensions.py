import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from apps.api.core.database import Base

class DimUser(Base):
    __tablename__ = "dim_user"

    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    demographic_cohort = Column(String(100), default="early_career_tech")
    persona_cluster = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    spendings = relationship("FactSpending", back_populates="user", cascade="all, delete-orphan")
    health_metrics = relationship("FactHealth", back_populates="user", cascade="all, delete-orphan")
    academics = relationship("FactAcademic", back_populates="user", cascade="all, delete-orphan")
    career_milestones = relationship("FactCareer", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("FactGoalProgress", back_populates="user", cascade="all, delete-orphan")
    decisions = relationship("FactDecision", back_populates="user", cascade="all, delete-orphan")
    consents = relationship("ConsentRecord", back_populates="user", cascade="all, delete-orphan")
    insights = relationship("Insight", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")


class DimTime(Base):
    __tablename__ = "dim_time"

    date_key = Column(Integer, primary_key=True)  # YYYYMMDD
    full_date = Column(Date, unique=True, nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0-6
    day_name = Column(String(20), nullable=False)
    week_number = Column(Integer, nullable=False)
    month_number = Column(Integer, nullable=False)
    month_name = Column(String(20), nullable=False)
    quarter = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    is_weekend = Column(Boolean, default=False, nullable=False)
    is_holiday = Column(Boolean, default=False, nullable=False)


class DimCategory(Base):
    __tablename__ = "dim_category"

    category_id = Column(String(50), primary_key=True)
    domain = Column(String(50), nullable=False, index=True)  # spending, health, academics, career, goal
    name = Column(String(100), nullable=False)
    parent_category = Column(String(100), nullable=True)
    is_essential = Column(Boolean, default=True, nullable=False)


class DimSource(Base):
    __tablename__ = "dim_source"

    source_id = Column(String(50), primary_key=True)
    source_name = Column(String(100), nullable=False)
    source_type = Column(String(50), nullable=False)  # manual, csv_upload, ocr_receipt, api, synthetic
    reliability_score = Column(Float, default=1.0)


class DimRegion(Base):
    __tablename__ = "dim_region"

    region_id = Column(String(50), primary_key=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    tier = Column(String(20), nullable=False)  # tier_1, tier_2, tier_3
    cost_of_living_index = Column(Float, default=100.0)
