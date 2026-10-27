import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base

class Insight(Base):
    __tablename__ = "insights"

    insight_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    domain = Column(String(50), nullable=False)  # finance, health, career, academic, multi
    title = Column(String(255), nullable=False)
    detail = Column(Text, nullable=False)
    metric_name = Column(String(100), nullable=True)
    metric_delta = Column(Float, nullable=True)
    severity = Column(String(20), default="info")  # info, warning, positive, critical
    action_recommendation = Column(Text, nullable=True)
    algorithm_source = Column(String(100), default="rule_mining")  # anomaly_detection, apriori, prophet, etc.
    is_dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("DimUser", back_populates="insights")


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    alert_type = Column(String(50), nullable=False)  # anomaly_detected, budget_exceeded, goal_milestone, decision_review
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("DimUser", back_populates="alerts")


class ConsentRecord(Base):
    """
    Aligned with India's DPDP Act 2023 & GDPR:
    Granular per-category consent tracking with timestamp and revocation capability.
    """
    __tablename__ = "consents"

    consent_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # spending, health, academics, career, public_benchmarking
    consent_granted = Column(Boolean, default=True, nullable=False)
    purpose = Column(String(255), default="Personalized decision intelligence and pattern mining")
    granted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("DimUser", back_populates="consents")


class AuditLog(Base):
    __tablename__ = "audit_log"

    log_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    action = Column(String(100), nullable=False)  # login, data_upload, consent_update, data_export, account_delete, copilot_query
    resource = Column(String(100), nullable=False)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    model_id = Column(String(50), primary_key=True)
    model_name = Column(String(100), nullable=False)  # isolation_forest_spending, kmeans_personas, etc.
    version = Column(String(20), nullable=False)
    algorithm = Column(String(100), nullable=False)
    metrics = Column(JSON, default=dict)  # silhouette_score, silhouette, precision, recall, etc.
    hyperparameters = Column(JSON, default=dict)
    trained_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class ShareableReport(Base):
    __tablename__ = "reports"

    report_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("dim_user.user_id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    access_token = Column(String(100), unique=True, nullable=False, index=True)
    sections_included = Column(JSON, default=list)  # ['spending', 'career', 'health', 'academics']
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
