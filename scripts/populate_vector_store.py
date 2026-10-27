import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from apps.api.core.database import AsyncSessionLocal
from apps.api.models.vector import DocChunk
from ml.rag_retrieval import index_document_chunk
from sqlalchemy import delete

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

async def populate_vector_store():
    print("-> Populating initial Grounded Vector Store Chunks...")
    async with AsyncSessionLocal() as session:
        # Clear existing chunks
        await session.execute(delete(DocChunk))
        await session.commit()

        # 1. Public Chunks (user_id = None)
        public_chunks = [
            (
                "public_edu",
                "public_education_stats:cse",
                "Computer Science & Engineering: Tier-1 placement rate is 94.5% with median CTC of ₹18.5 LPA. Top recruiters include Google, Microsoft, Uber, CRED. Tier-2 placement is 82.0% at ₹9.2 LPA.",
                {"domain": "academics", "branch": "CSE"}
            ),
            (
                "public_edu",
                "public_education_stats:ece",
                "Electronics & Communication Engineering (ECE): Tier-1 placement rate is 88.0% with median CTC of ₹14.2 LPA. Top recruiters include Qualcomm, NVIDIA, Texas Instruments, Intel. Tier-2 placement is 72.0% at ₹7.8 LPA.",
                {"domain": "academics", "branch": "ECE"}
            ),
            (
                "public_job",
                "public_job_trends:ai_engineer",
                "AI/ML Engineer Job Market: Average compensation is ₹24.0 LPA with +34.5% year-over-year demand growth. Key high-value competencies: PyTorch, Transformers, pgvector, FastAPI, Vector Search.",
                {"domain": "career", "role": "AI/ML Engineer"}
            ),
            (
                "public_job",
                "public_job_trends:cloud_architect",
                "Cloud Solutions Architect: Average compensation is ₹27.5 LPA with +22.0% YoY growth. High demand across Tier-1 tech hubs for GCP, Kubernetes, Terraform, and distributed systems architecture.",
                {"domain": "career", "role": "Cloud Architect"}
            ),
            (
                "public_market",
                "public_market_data:macro_2026",
                "Macroeconomic Benchmarks: CPI Inflation is 4.1%, RBI repo rate is 5.75%, education loan average interest is 9.25%, and fixed deposit baseline yield is 6.5%.",
                {"domain": "macro", "period": "2026"}
            ),
        ]

        for stype, sref, content, meta in public_chunks:
            await index_document_chunk(session, None, stype, sref, content, meta)

        # 2. Demo User Private Warehouse Chunks (user_id = DEMO_USER_ID)
        user_chunks = [
            (
                "career",
                "fact_career:sde1",
                "Current Employment: Aarav Sharma is employed as Full-Stack / AI Engineer at a Tier-1 tech company with an annual CTC of ₹15,50,000 and net monthly in-hand compensation of ₹1,12,000.",
                {"domain": "career", "date": "2025-09-01"}
            ),
            (
                "spending",
                "fact_spending:summary",
                "Monthly Financial Overview: Average monthly burn rate is ₹48,500 (Rent: ₹26,000, Food & Dining: ₹12,500, Utilities & Bills: ₹3,500, Transit: ₹3,200, Subscriptions: ₹1,500). Unallocated monthly surplus is ₹63,500.",
                {"domain": "finance", "savings_rate_pct": 41.5}
            ),
            (
                "goal",
                "fact_goal:emergency_fund",
                "Emergency Liquid Fund Goal: Target is ₹2,50,000, currently at ₹2,10,000 (84% progress). Monthly savings allocation is ₹15,000. Projected completion date is December 2026.",
                {"domain": "finance", "progress_pct": 84.0}
            ),
            (
                "academics",
                "fact_academic:performance",
                "Academic Transcript: Cumulative GPA is 8.65. Standout courses: Artificial Intelligence & ML (9.4 GPA), Cloud Computing (9.2 GPA), Database Management Systems (9.0 GPA), Data Structures (8.5 GPA).",
                {"domain": "academics", "cgpa": 8.65}
            ),
            (
                "health",
                "fact_health:patterns",
                "Health & Sleep Architecture: Baseline sleep is 7.4 hours with low stress (32/100). During May and November exam/crunch weeks, sleep drops to 5.1 hours and stress spikes to 82/100 ($r = -0.74$).",
                {"domain": "health", "correlation": -0.74}
            ),
            (
                "decision",
                "fact_decision:relocation",
                "Lifestyle Decision: Relocated to Central Tech Corridor on August 15, 2026. Decreased daily commute from 50 min to 10 min, saving 80 hours monthly and increasing sleep by 45 min/day.",
                {"domain": "lifestyle", "status": "pending_review"}
            ),
        ]

        for stype, sref, content, meta in user_chunks:
            await index_document_chunk(session, DEMO_USER_ID, stype, sref, content, meta)

    print("-> Successfully indexed 11 grounded document chunks into the Vector Store.")

if __name__ == "__main__":
    asyncio.run(populate_vector_store())
