import asyncio
import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from apps.api.core.database import engine, Base, AsyncSessionLocal
from apps.api.models import *
from ml.synthetic_generator import seed_dimensions, seed_public_datasets, seed_demo_user, seed_peer_cohorts

async def run_seed():
    print("==========================================================")
    print("LifeStack — Database Initializer & Synthetic Seed Runner")
    print("==========================================================")

    # 1. Create database schema tables
    print("1. Creating database tables if not exist...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("   -> Schema tables successfully verified.")

    # 2. Seed Data
    async with AsyncSessionLocal() as session:
        print("2. Seeding Dimensions (Categories, Sources, Regions, Time)...")
        await seed_dimensions(session)

        print("3. Seeding Public Datasets (Job Trends, Education ROI, Macro)...")
        await seed_public_datasets(session)

        print("4. Seeding Primary Demo User (Aarav Sharma - demo@lifestack.ai)...")
        await seed_demo_user(session)

        print("5. Seeding 500 Anonymized Peer Cohorts (k-anonymity k >= 10)...")
        await seed_peer_cohorts(session)

    print("==========================================================")
    print("-> SEED COMPLETE!")
    print("   Demo User: demo@lifestack.ai")
    print("   Password:  Password123!")
    print("==========================================================")

if __name__ == "__main__":
    asyncio.run(run_seed())
