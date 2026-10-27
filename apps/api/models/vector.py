import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from apps.api.core.database import Base

class DocChunk(Base):
    """
    Document Chunk store for Grounded GenAI RAG.
    Matches schema definition from 04_pgvector_rag.sql.
    Supports user_id = NULL for public reference documents (open datasets, college benchmarks),
    and user_id = <UUID> for private personal warehouse chunks.
    """
    __tablename__ = "doc_chunks"

    chunk_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=True, index=True)  # NULL = public knowledge
    source_type = Column(String(50), nullable=False, index=True)  # insight, upload, public_job, public_edu, goal, fact
    source_ref = Column(String(100), nullable=True)  # e.g., 'insights:42', 'spending:2026-03-01'
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    # Stored as serialized vector array (768 float numbers)
    # In PostgreSQL with pgvector, mapped to vector(768)
    embedding_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
