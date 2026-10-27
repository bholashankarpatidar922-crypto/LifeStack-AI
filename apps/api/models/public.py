from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, JSON
from apps.api.core.database import Base

class PublicJobTrends(Base):
    __tablename__ = "public_job_trends"

    trend_id = Column(String(50), primary_key=True)
    role_title = Column(String(150), nullable=False, index=True)
    domain = Column(String(100), nullable=False)  # AI/ML, Cloud, Full-Stack, Data Science, Embedded, Finance
    average_salary_inr = Column(Float, nullable=False)
    yoy_growth_pct = Column(Float, nullable=False)
    open_positions_index = Column(Float, nullable=False)  # Index 0-100
    required_skills = Column(JSON, default=list)
    tier_1_city_demand = Column(Float, default=80.0)
    updated_at = Column(DateTime, default=datetime.utcnow)


class PublicEducationStats(Base):
    __tablename__ = "public_education_stats"

    stat_id = Column(String(50), primary_key=True)
    course_branch = Column(String(100), nullable=False, index=True)  # CSE, ECE, Data Science, MBA, etc.
    tier = Column(String(20), nullable=False)  # Tier-1, Tier-2, Tier-3
    average_placement_rate = Column(Float, nullable=False)  # Percentage 0-100
    median_package_lpa = Column(Float, nullable=False)      # LPA in INR
    top_recruiters = Column(JSON, default=list)
    roi_index = Column(Float, nullable=False)               # Composite score
    source_citation = Column(String(255), default="National Higher Education Survey (Open Data CC-BY 4.0)")


class PublicMarketData(Base):
    __tablename__ = "public_market_data"

    market_id = Column(String(50), primary_key=True)
    date = Column(Date, nullable=False, index=True)
    inflation_cpi = Column(Float, nullable=False)        # CPI percentage
    repo_rate = Column(Float, nullable=False)            # Repo rate percentage
    edu_loan_rate_avg = Column(Float, nullable=False)    # Average education loan interest
    fd_rate_avg = Column(Float, nullable=False)          # Fixed deposit benchmark
    equity_benchmark_return = Column(Float, default=12.0)# Benchmark equity return %
    updated_at = Column(DateTime, default=datetime.utcnow)
