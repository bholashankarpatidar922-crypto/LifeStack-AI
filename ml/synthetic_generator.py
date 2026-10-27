import random
import uuid
from datetime import datetime, date, timedelta
import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from apps.api.core.security import get_password_hash
from apps.api.models.dimensions import DimUser, DimTime, DimCategory, DimSource, DimRegion
from apps.api.models.facts import FactSpending, FactHealth, FactAcademic, FactCareer, FactGoalProgress, FactDecision
from apps.api.models.public import PublicJobTrends, PublicEducationStats, PublicMarketData
from apps.api.models.system import Insight, Alert, ConsentRecord, ModelRegistry
from apps.api.models.vector import DocChunk

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"
DEMO_EMAIL = "demo@lifestack.ai"
DEMO_PASSWORD = "Password123!"

CATEGORIES_DEF = [
    # Spending categories
    ("cat_groceries", "spending", "Groceries & Supermarket", "Food", True),
    ("cat_dining", "spending", "Dining Out & Delivery", "Food", False),
    ("cat_rent", "spending", "Rent & Housing", "Housing", True),
    ("cat_utilities", "spending", "Utilities & Bills", "Housing", True),
    ("cat_transit", "spending", "Commute & Fuel", "Transport", True),
    ("cat_courses", "spending", "Courses & Books", "Education", False),
    ("cat_electronics", "spending", "Electronics & Tech", "Shopping", False),
    ("cat_health", "spending", "Pharmacy & Medical", "Health", True),
    ("cat_fitness", "spending", "Gym & Sports", "Health", False),
    ("cat_entertainment", "spending", "Streaming & Movies", "Leisure", False),
    ("cat_travel", "spending", "Flights & Hotels", "Travel", False),
    # Other domains
    ("cat_sleep", "health", "Sleep Architecture", "Health", True),
    ("cat_vitals", "health", "Daily Vitals", "Health", True),
    ("cat_degree", "academics", "University Degree", "Education", True),
    ("cat_job", "career", "Employment Milestone", "Career", True),
    ("cat_goal_save", "goal", "Financial Savings", "Goals", True),
]

SOURCES_DEF = [
    ("src_manual", "Manual App Entry", "manual", 1.0),
    ("src_hdfc_csv", "Bank Statement CSV Upload", "csv_upload", 0.98),
    ("src_ocr_receipt", "Smart Document Scanner (OCR)", "ocr_receipt", 0.95),
    ("src_synthetic", "LifeStack Deterministic Seed Engine", "synthetic", 1.0),
]

REGIONS_DEF = [
    ("reg_blr", "Bengaluru", "Karnataka", "tier_1", 125.0),
    ("reg_hyd", "Hyderabad", "Telangana", "tier_1", 110.0),
    ("reg_pune", "Pune", "Maharashtra", "tier_2", 98.0),
    ("reg_delhi", "Delhi NCR", "Delhi", "tier_1", 120.0),
    ("reg_jaipur", "Jaipur", "Rajasthan", "tier_2", 85.0),
]

async def seed_dimensions(session: AsyncSession):
    # Categories
    for cid, domain, name, parent, is_ess in CATEGORIES_DEF:
        cat = await session.get(DimCategory, cid)
        if not cat:
            session.add(DimCategory(
                category_id=cid,
                domain=domain,
                name=name,
                parent_category=parent,
                is_essential=is_ess
            ))

    # Sources
    for sid, name, stype, score in SOURCES_DEF:
        src = await session.get(DimSource, sid)
        if not src:
            session.add(DimSource(
                source_id=sid,
                source_name=name,
                source_type=stype,
                reliability_score=score
            ))

    # Regions
    for rid, city, state, tier, col in REGIONS_DEF:
        reg = await session.get(DimRegion, rid)
        if not reg:
            session.add(DimRegion(
                region_id=rid,
                city=city,
                state=state,
                tier=tier,
                cost_of_living_index=col
            ))
    
    # Time dimension (3 years: Nov 1, 2023 to Oct 25, 2026)
    start_date = date(2023, 11, 1)
    end_date = date(2026, 10, 25)
    curr = start_date
    while curr <= end_date:
        d_key = int(curr.strftime("%Y%m%d"))
        t_row = await session.get(DimTime, d_key)
        if not t_row:
            session.add(DimTime(
                date_key=d_key,
                full_date=curr,
                day_of_week=curr.weekday(),
                day_name=curr.strftime("%A"),
                week_number=int(curr.strftime("%W")),
                month_number=curr.month,
                month_name=curr.strftime("%B"),
                quarter=(curr.month - 1) // 3 + 1,
                year=curr.year,
                is_weekend=curr.weekday() in [5, 6],
                is_holiday=(curr.month == 1 and curr.day == 26) or (curr.month == 8 and curr.day == 15) or (curr.month == 10 and curr.day == 2)
            ))
        curr += timedelta(days=1)

    await session.commit()


async def seed_public_datasets(session: AsyncSession):
    # Public Job Trends
    jobs = [
        ("trend_ai_eng", "AI/ML Engineer", "AI/ML", 2400000.0, 34.5, 95.0, ["PyTorch", "Transformers", "pgvector", "FastAPI"], 92.0),
        ("trend_cloud_arch", "Cloud Solutions Architect", "Cloud", 2750000.0, 22.0, 88.0, ["GCP", "Kubernetes", "Terraform", "Security"], 86.0),
        ("trend_fullstack", "Full-Stack Engineer", "Full-Stack", 1650000.0, 18.5, 90.0, ["React", "TypeScript", "Python", "PostgreSQL"], 85.0),
        ("trend_data_analyst", "Decision Intelligence Analyst", "Data Science", 1350000.0, 25.0, 82.0, ["SQL", "Tableau", "Forecasting", "Statistics"], 78.0),
        ("trend_devops", "DevSecOps Engineer", "Cloud", 1950000.0, 26.0, 84.0, ["Docker", "CI/CD", "Prometheus", "Linux"], 80.0),
    ]
    for jid, title, dom, sal, yoy, idx, skills, t1 in jobs:
        row = await session.get(PublicJobTrends, jid)
        if not row:
            session.add(PublicJobTrends(
                trend_id=jid,
                role_title=title,
                domain=dom,
                average_salary_inr=sal,
                yoy_growth_pct=yoy,
                open_positions_index=idx,
                required_skills=skills,
                tier_1_city_demand=t1
            ))

    # Public Education Stats
    edu_stats = [
        ("stat_cse_t1", "Computer Science & Engineering", "Tier-1", 94.5, 18.5, ["Google", "Microsoft", "Uber", "CRED"], 94.0),
        ("stat_cse_t2", "Computer Science & Engineering", "Tier-2", 82.0, 9.2, ["Infosys", "TCS", "Accenture", "Cognizant"], 78.0),
        ("stat_ece_t1", "Electronics & Communication", "Tier-1", 88.0, 14.2, ["Qualcomm", "NVIDIA", "Texas Instruments", "Intel"], 86.0),
        ("stat_ece_t2", "Electronics & Communication", "Tier-2", 72.0, 7.8, ["L&T", "Bosch", "Wipro", "Capgemini"], 70.0),
        ("stat_ds_t1", "Data Science & AI", "Tier-1", 93.0, 17.0, ["Amazon", "Fractal", "Tiger Analytics", "Flipkart"], 91.0),
    ]
    for sid, branch, tier, rate, pkg, recruiters, roi in edu_stats:
        row = await session.get(PublicEducationStats, sid)
        if not row:
            session.add(PublicEducationStats(
                stat_id=sid,
                course_branch=branch,
                tier=tier,
                average_placement_rate=rate,
                median_package_lpa=pkg,
                top_recruiters=recruiters,
                roi_index=roi
            ))

    # Public Market Data (Quarterly snapshots)
    mkt = [
        ("mkt_2024_q1", date(2024, 3, 31), 5.1, 6.5, 10.25, 7.1, 14.5),
        ("mkt_2024_q3", date(2024, 9, 30), 4.8, 6.5, 10.0, 7.25, 15.2),
        ("mkt_2025_q1", date(2025, 3, 31), 4.6, 6.25, 9.75, 7.0, 13.8),
        ("mkt_2025_q3", date(2025, 9, 30), 4.3, 6.0, 9.5, 6.75, 16.0),
        ("mkt_2026_q1", date(2026, 3, 31), 4.1, 5.75, 9.25, 6.5, 14.2),
    ]
    for mid, dt, cpi, repo, loan, fd, eq in mkt:
        row = await session.get(PublicMarketData, mid)
        if not row:
            session.add(PublicMarketData(
                market_id=mid,
                date=dt,
                inflation_cpi=cpi,
                repo_rate=repo,
                edu_loan_rate_avg=loan,
                fd_rate_avg=fd,
                equity_benchmark_return=eq
            ))

    await session.commit()


async def seed_demo_user(session: AsyncSession):
    # Set deterministic seeds
    random.seed(42)
    np.random.seed(42)

    # Check if demo user already exists
    demo_user = await session.get(DimUser, DEMO_USER_ID)
    if not demo_user:
        demo_user = DimUser(
            user_id=DEMO_USER_ID,
            email=DEMO_EMAIL,
            full_name="Aarav Sharma",
            hashed_password=get_password_hash(DEMO_PASSWORD),
            role="user",
            demographic_cohort="early_career_tech",
            persona_cluster=1,  # Career Accelerator
            is_active=True,
            created_at=datetime(2023, 11, 1, 9, 0, 0)
        )
        session.add(demo_user)
        await session.flush()

    # Consents (DPDP Act 2023 compliant)
    for cat in ["spending", "health", "academics", "career", "public_benchmarking"]:
        c_rec = ConsentRecord(
            user_id=DEMO_USER_ID,
            category=cat,
            consent_granted=True,
            purpose=f"LifeStack decision analysis & AI grounding for {cat}",
            granted_at=datetime(2023, 11, 1, 9, 5, 0)
        )
        session.add(c_rec)

    # Clean existing facts for demo user to ensure idempotency
    await session.execute(delete(FactSpending).where(FactSpending.user_id == DEMO_USER_ID))
    await session.execute(delete(FactHealth).where(FactHealth.user_id == DEMO_USER_ID))
    await session.execute(delete(FactAcademic).where(FactAcademic.user_id == DEMO_USER_ID))
    await session.execute(delete(FactCareer).where(FactCareer.user_id == DEMO_USER_ID))
    await session.execute(delete(FactGoalProgress).where(FactGoalProgress.user_id == DEMO_USER_ID))
    await session.execute(delete(FactDecision).where(FactDecision.user_id == DEMO_USER_ID))
    await session.execute(delete(Insight).where(Insight.user_id == DEMO_USER_ID))
    await session.execute(delete(Alert).where(Alert.user_id == DEMO_USER_ID))

    # 3-Year Time Horizon: 2023-11-01 to 2026-10-25
    start_date = date(2023, 11, 1)
    end_date = date(2026, 10, 25)
    curr = start_date
    day_count = 0

    spendings = []
    healths = []

    # Injected anomaly dates
    anomaly_dates = {
        date(2024, 4, 18): ("cat_electronics", 58500.0, "Apple Store Bengaluru - M3 MacBook Air", "Electronics & Tech"),
        date(2024, 11, 24): ("cat_health", 16800.0, "Manipal Hospital - Annual Health Panel & Scans", "Pharmacy & Medical"),
        date(2025, 3, 14): ("cat_fitness", 18000.0, "Cult.fit Annual Elite Pass Renewal", "Gym & Sports"),
        date(2025, 7, 22): ("cat_travel", 34500.0, "IndiGo Flights & Stay - Goa Tech Offsite", "Flights & Hotels"),
        date(2026, 2, 10): ("cat_courses", 42000.0, "DeepLearning.AI + Cloud Architect Specialization", "Courses & Books"),
        date(2026, 6, 15): ("cat_electronics", 28000.0, "Ergonomic Desk & Herman Miller Chair (Refurb)", "Electronics & Tech"),
    }

    while curr <= end_date:
        d_key = int(curr.strftime("%Y%m%d"))
        is_weekend = curr.weekday() in [5, 6]
        
        # Monthly Rent on the 2nd
        if curr.day == 2:
            rent_amount = 22000.0 if curr < date(2025, 5, 1) else 26000.0
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=rent_amount,
                category_id="cat_rent",
                category_name="Rent & Housing",
                merchant="Landlord Bank Transfer",
                payment_method="NetBanking",
                source_id="src_hdfc_csv",
                is_anomaly=False,
                is_synthetic=True
            ))

        # Utilities on the 5th
        if curr.day == 5:
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=round(random.uniform(2200.0, 4800.0), 2),
                category_id="cat_utilities",
                category_name="Utilities & Bills",
                merchant="BESCOM & ACT Fibernet",
                payment_method="UPI",
                source_id="src_hdfc_csv",
                is_anomaly=False,
                is_synthetic=True
            ))

        # Subscriptions on the 10th
        if curr.day == 10:
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=1499.0,
                category_id="cat_entertainment",
                category_name="Streaming & Movies",
                merchant="Netflix / Spotify / Claude Pro",
                payment_method="Credit Card",
                source_id="src_hdfc_csv",
                is_anomaly=False,
                is_synthetic=True
            ))

        # Regular daily groceries
        if random.random() < 0.65:
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=round(random.uniform(280.0, 1450.0), 2),
                category_id="cat_groceries",
                category_name="Groceries & Supermarket",
                merchant=random.choice(["Blinkit", "Zepto", "Nature's Basket", "Local Kirana"]),
                payment_method="UPI",
                source_id="src_hdfc_csv",
                is_anomaly=False,
                is_synthetic=True
            ))

        # Dining out / Swiggy / Zomato (heavier on weekends)
        dining_prob = 0.75 if is_weekend else 0.35
        if random.random() < dining_prob:
            base_amt = random.uniform(450.0, 2200.0) if is_weekend else random.uniform(220.0, 850.0)
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=round(base_amt, 2),
                category_id="cat_dining",
                category_name="Dining Out & Delivery",
                merchant=random.choice(["Swiggy", "Zomato", "Third Wave Coffee", "Toit Brewpub", "Truffles"]),
                payment_method="UPI",
                source_id="src_hdfc_csv",
                is_anomaly=False,
                is_synthetic=True
            ))

        # Commute on weekdays
        if not is_weekend and random.random() < 0.8:
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=round(random.uniform(90.0, 380.0), 2),
                category_id="cat_transit",
                category_name="Commute & Fuel",
                merchant=random.choice(["Uber India", "Namma Metro", "Shell Petrol"]),
                payment_method="UPI",
                source_id="src_hdfc_csv",
                is_anomaly=False,
                is_synthetic=True
            ))

        # Check for injected spending anomaly
        if curr in anomaly_dates:
            cat_id, amt, merch, cat_name = anomaly_dates[curr]
            spendings.append(FactSpending(
                user_id=DEMO_USER_ID,
                date_key=d_key,
                date=curr,
                amount=amt,
                category_id=cat_id,
                category_name=cat_name,
                merchant=merch,
                payment_method="Credit Card",
                source_id="src_hdfc_csv",
                is_anomaly=True,
                is_synthetic=True,
                notes="Injected spending anomaly for Isolation Forest detection"
            ))

        # --- Health Data Generation with Genuine Correlations ---
        # Exam / major release crunch periods:
        # May & November each year
        is_crunch_period = (curr.month in [5, 11] and 10 <= curr.day <= 25)
        
        if is_crunch_period:
            sleep_hours = round(random.gauss(5.2, 0.6), 1)
            stress_score = round(min(100.0, max(65.0, random.gauss(82.0, 6.0))), 1)
            steps = int(random.gauss(4200, 900))
            mood_score = round(min(10.0, max(2.5, random.gauss(4.2, 0.8))), 1)
            is_health_anomaly = True
        else:
            sleep_hours = round(min(9.5, max(6.0, random.gauss(7.4, 0.5))), 1)
            stress_score = round(min(60.0, max(15.0, random.gauss(32.0, 8.0))), 1)
            steps = int(random.gauss(8600, 1800))
            mood_score = round(min(9.8, max(5.5, random.gauss(7.8, 0.6))), 1)
            is_health_anomaly = False

        healths.append(FactHealth(
            user_id=DEMO_USER_ID,
            date_key=d_key,
            date=curr,
            sleep_hours=max(3.0, sleep_hours),
            steps=max(1200, steps),
            heart_rate_avg=int(random.gauss(74 if is_crunch_period else 68, 4)),
            stress_score=stress_score,
            mood_score=mood_score,
            water_liters=round(random.uniform(1.8, 3.2), 1),
            screen_time_hours=round(random.uniform(7.5, 11.0) if is_crunch_period else random.uniform(4.5, 7.5), 1),
            is_anomaly=is_health_anomaly,
            is_synthetic=True
        ))

        curr += timedelta(days=1)
        day_count += 1

    session.add_all(spendings)
    session.add_all(healths)

    # --- Academic Milestones ---
    academics = [
        FactAcademic(user_id=DEMO_USER_ID, semester=1, course_name="Data Structures & Algorithms", course_code="CS201", credits=4, grade_point=8.5, attendance_pct=92.0, study_hours_wk=14.0, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=1, course_name="Discrete Mathematics", course_code="MA201", credits=3, grade_point=8.0, attendance_pct=88.5, study_hours_wk=10.0, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=2, course_name="Database Management Systems", course_code="CS202", credits=4, grade_point=9.0, attendance_pct=94.0, study_hours_wk=15.0, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=2, course_name="Computer Networks", course_code="CS204", credits=3, grade_point=8.2, attendance_pct=85.0, study_hours_wk=9.0, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=3, course_name="Operating Systems", course_code="CS301", credits=4, grade_point=8.4, attendance_pct=90.0, study_hours_wk=13.0, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=3, course_name="Software Engineering", course_code="CS303", credits=3, grade_point=8.7, attendance_pct=91.0, study_hours_wk=8.5, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=4, course_name="Artificial Intelligence & ML", course_code="CS401", credits=4, grade_point=9.4, attendance_pct=96.0, study_hours_wk=18.0, is_synthetic=True),
        FactAcademic(user_id=DEMO_USER_ID, semester=4, course_name="Cloud Computing & Distributed Systems", course_code="CS403", credits=4, grade_point=9.2, attendance_pct=93.0, study_hours_wk=16.0, is_synthetic=True),
    ]
    session.add_all(academics)

    # --- Career Milestones ---
    careers = [
        FactCareer(user_id=DEMO_USER_ID, date=date(2023, 11, 1), role_title="Software Engineering Intern", company_tier="startup", salary_inr=360000.0, monthly_inhand=30000.0, applications_sent=45, interviews_count=8, offers_count=2, skills_acquired="Python, FastAPI, Docker", is_synthetic=True),
        FactCareer(user_id=DEMO_USER_ID, date=date(2024, 7, 1), role_title="Junior Software Engineer", company_tier="tier_2", salary_inr=850000.0, monthly_inhand=62000.0, applications_sent=15, interviews_count=5, offers_count=1, skills_acquired="React, PostgreSQL, CI/CD", is_synthetic=True),
        FactCareer(user_id=DEMO_USER_ID, date=date(2025, 9, 1), role_title="Full-Stack / AI Engineer", company_tier="tier_1", salary_inr=1550000.0, monthly_inhand=112000.0, applications_sent=6, interviews_count=4, offers_count=2, skills_acquired="pgvector, LangChain, Kubernetes, System Design", is_synthetic=True),
    ]
    session.add_all(careers)

    # --- Goals ---
    goals = [
        FactGoalProgress(user_id=DEMO_USER_ID, domain="finance", title="Emergency Liquid Fund", description="Build 6 months of non-discretionary expenses in liquid high-interest fund", target_amount_or_metric=250000.0, current_amount_or_metric=210000.0, target_date=date(2026, 12, 31), progress_pct=84.0, status="in_progress", monthly_savings_allocated=15000.0, is_synthetic=True),
        FactGoalProgress(user_id=DEMO_USER_ID, domain="career", title="GCP Professional Cloud Architect Certification", description="Complete study path, hands-on labs, and clear official exam", target_amount_or_metric=100.0, current_amount_or_metric=100.0, target_date=date(2025, 8, 15), progress_pct=100.0, status="achieved", monthly_savings_allocated=0.0, is_synthetic=True),
        FactGoalProgress(user_id=DEMO_USER_ID, domain="finance", title="Higher Education / Masters Overseas Fund", description="Accumulate self-funded margin for MS in CS / AI in Germany or US", target_amount_or_metric=1200000.0, current_amount_or_metric=480000.0, target_date=date(2027, 8, 31), progress_pct=40.0, status="in_progress", monthly_savings_allocated=35000.0, is_synthetic=True),
        FactGoalProgress(user_id=DEMO_USER_ID, domain="health", title="Half Marathon Finish & 10k Daily Steps", description="Sub-2-hour half marathon and maintain >= 9,000 avg steps/day", target_amount_or_metric=9000.0, current_amount_or_metric=8400.0, target_date=date(2026, 12, 15), progress_pct=93.3, status="in_progress", monthly_savings_allocated=0.0, is_synthetic=True),
    ]
    session.add_all(goals)

    # --- Decisions Journal ---
    decisions = [
        FactDecision(
            user_id=DEMO_USER_ID,
            date=date(2024, 6, 20),
            category="career",
            title="Choose between Startup AI role vs Mid-size FinTech",
            details="Startup offered 8.5 LPA with higher equity and direct mentorship from ex-Google founder; FinTech offered 9.2 LPA with established tooling.",
            options_considered=["Startup AI Engineer (8.5 LPA)", "FinTech Backend Developer (9.2 LPA)"],
            chosen_option="Startup AI Engineer (8.5 LPA)",
            predicted_outcome="Faster technical growth and mastery of AI stack will yield >= 60% higher market compensation in Year 2.",
            confidence_score=0.88,
            actual_outcome="Promoted in 14 months and transitioned to 15.5 LPA SDE-1 role. Hypothesis strongly confirmed.",
            outcome_score=9.5,
            review_scheduled_date=date(2025, 9, 1),
            status="validated"
        ),
        FactDecision(
            user_id=DEMO_USER_ID,
            date=date(2025, 4, 10),
            category="finance",
            title="Upfront Payment vs 9-Month No-Cost EMI for AI Certification",
            details="Considered paying Rs 38,000 lump sum vs Rs 4,222/mo EMI while keeping liquid funds in high-yield arbitrage fund (7.2% return).",
            options_considered=["Lump Sum Upfront", "9-Month No-Cost EMI"],
            chosen_option="9-Month No-Cost EMI",
            predicted_outcome="Arbitrage yield preserves liquidity cushion without impacting credit score or monthly savings target.",
            confidence_score=0.92,
            actual_outcome="Maintained emergency fund buffer without dipping into savings; all EMIs paid on time.",
            outcome_score=9.0,
            review_scheduled_date=date(2026, 1, 15),
            status="validated"
        ),
        FactDecision(
            user_id=DEMO_USER_ID,
            date=date(2026, 8, 15),
            category="lifestyle",
            title="Move to Indiranagar (Higher Rent, 10 min commute) vs Whitefield (Lower Rent, 50 min commute)",
            details="Rent differential of Rs 7,000/month evaluated against ~80 hours saved in monthly transit and sleep gain.",
            options_considered=["Indiranagar (10 min commute, +7k rent)", "Whitefield (50 min commute, -7k rent)"],
            chosen_option="Indiranagar (10 min commute, +7k rent)",
            predicted_outcome="Reclaiming 1.5 hours daily will improve sleep duration by >= 45 min and lower stress score by 15 points.",
            confidence_score=0.85,
            actual_outcome=None,
            outcome_score=None,
            review_scheduled_date=date(2026, 11, 15),
            status="pending_review"
        )
    ]
    session.add_all(decisions)

    # --- Initial Proactive Insights ---
    insights = [
        Insight(
            user_id=DEMO_USER_ID,
            domain="finance",
            title="Discretionary Food Delivery Outpacing Dining Out",
            detail="Swiggy/Zomato orders totaled Rs 14,200 last month (+28% vs 90-day moving average), primarily on weekday evenings following high-stress workdays.",
            metric_name="monthly_food_delivery_inr",
            metric_delta=28.4,
            severity="warning",
            action_recommendation="Setting a weekday delivery cap of Rs 2,500/week will save approx Rs 4,800/month, accelerating your Emergency Fund goal by 1.8 months.",
            algorithm_source="anomaly_detection"
        ),
        Insight(
            user_id=DEMO_USER_ID,
            domain="health",
            title="Exam Crunch Sleep Deprivation Pattern Discovered",
            detail="During May and November academic crunch weeks, average sleep drops to 5.1 hrs/night, accompanied by a 2.4x spike in daily stress and 18% lower weekend step count.",
            metric_name="sleep_stress_correlation",
            metric_delta=-0.74,
            severity="critical",
            action_recommendation="Implement a 3-week pre-study buffer and enforce a hard 11:30 PM screen curfew to keep sleep >= 6.5 hours during exam intervals.",
            algorithm_source="correlation_engine"
        ),
        Insight(
            user_id=DEMO_USER_ID,
            domain="career",
            title="Skills Vector Strong for Cloud Solutions Architect",
            detail="Your verified competencies in Python, FastAPI, Docker, and PostgreSQL match 78% of the requirements for Tier-1 Cloud Architect openings paying 24-28 LPA.",
            metric_name="market_skill_match_pct",
            metric_delta=15.0,
            severity="positive",
            action_recommendation="Adding Terraform and Kubernetes hands-on projects will increase candidate ranking to the 92nd percentile.",
            algorithm_source="classification"
        )
    ]
    session.add_all(insights)

    # --- Initial Alerts ---
    alerts = [
        Alert(
            user_id=DEMO_USER_ID,
            alert_type="anomaly_detected",
            title="Unusual Expense Detected: Tech Upgrade",
            message="Rs 58,500 at Apple Store Bengaluru was flagged as a statistical outlier (3.8 sigma above mean daily spend).",
            link="/dashboard/spending"
        ),
        Alert(
            user_id=DEMO_USER_ID,
            alert_type="goal_milestone",
            title="Emergency Fund Goal Reached 84%!",
            message="You are Rs 40,000 away from your Rs 2,50,000 target. At your current trajectory, you will complete it in 78 days.",
            link="/goals"
        ),
        Alert(
            user_id=DEMO_USER_ID,
            alert_type="decision_review",
            title="Scheduled Decision Review Coming Up",
            message="Your lifestyle decision 'Indiranagar Relocation' is scheduled for outcome review on Nov 15, 2026.",
            link="/decisions"
        )
    ]
    session.add_all(alerts)

    await session.commit()
    print(f"-> Seeded Demo User ({DEMO_EMAIL}) with {day_count} days of multi-domain data.")


async def seed_peer_cohorts(session: AsyncSession):
    """
    Generates 500 anonymized peer profiles for k-anonymous peer benchmarking (k >= 10)
    and K-Means persona clustering across 4 archetypes:
    0: Conservative Savers (30%)
    1: Career Accelerators (30%)
    2: Balanced Lifestylers (20%)
    3: High-Stress Freelancers (20%)
    """
    random.seed(1337)
    np.random.seed(1337)

    # Check if peers already exist
    res = await session.execute(select(DimUser).where(DimUser.user_id != DEMO_USER_ID).limit(5))
    if len(res.scalars().all()) >= 5:
        print("-> Peer cohort already seeded (>= 5 records found). Skipping.")
        return

    print("-> Seeding 500 anonymized peer profiles for k-anonymity benchmarking...")
    archetypes = [
        (0, "Conservative Saver", 0.30, (45000, 90000), (0.45, 0.65), (7.0, 8.5), (15, 35)),
        (1, "Career Accelerator", 0.30, (70000, 180000), (0.25, 0.45), (6.0, 7.5), (35, 65)),
        (2, "Balanced Lifestyler", 0.20, (55000, 120000), (0.20, 0.40), (7.2, 8.2), (20, 45)),
        (3, "High-Stress Freelancer", 0.20, (40000, 150000), (0.15, 0.35), (5.5, 7.0), (55, 85)),
    ]

    peer_users = []
    peer_spendings = []
    peer_healths = []
    
    # We create peer summary metrics over the last 90 days for benchmarking
    recent_dates = [date(2026, 10, 25) - timedelta(days=i) for i in range(30)]

    for i in range(500):
        # Pick archetype based on distribution
        r = random.random()
        cum = 0.0
        chosen_arch = archetypes[0]
        for arch in archetypes:
            cum += arch[2]
            if r <= cum:
                chosen_arch = arch
                break
        
        cluster_id, persona_name, _, inc_range, sav_range, sleep_range, stress_range = chosen_arch
        user_uuid = f"peer-{i:04d}-{uuid.uuid4().hex[:8]}"
        
        income = round(random.uniform(*inc_range), -2)
        savings_rate = round(random.uniform(*sav_range), 2)
        monthly_spend = income * (1.0 - savings_rate)
        
        p_user = DimUser(
            user_id=user_uuid,
            email=f"peer_{i:04d}@anonymized.local",
            full_name=f"Peer Cohort #{i+1}",
            hashed_password="[ANONYMIZED_PEER_HASH]",
            role="peer_cohort",
            demographic_cohort="early_career_tech",
            persona_cluster=cluster_id,
            is_active=True,
            created_at=datetime(2024, 1, 1)
        )
        peer_users.append(p_user)

        # 30 days of representative aggregated records per peer
        for d in recent_dates:
            d_key = int(d.strftime("%Y%m%d"))
            day_spend = round((monthly_spend / 30.0) * random.uniform(0.6, 1.4), 2)
            
            peer_spendings.append(FactSpending(
                user_id=user_uuid,
                date_key=d_key,
                date=d,
                amount=day_spend,
                category_id="cat_groceries" if random.random() > 0.4 else "cat_dining",
                category_name="Groceries & Supermarket" if random.random() > 0.4 else "Dining Out",
                merchant="Peer Retail",
                payment_method="UPI",
                source_id="src_synthetic",
                is_anomaly=False,
                is_synthetic=True
            ))

            peer_healths.append(FactHealth(
                user_id=user_uuid,
                date_key=d_key,
                date=d,
                sleep_hours=round(random.uniform(*sleep_range), 1),
                steps=int(random.gauss(7500, 1500)),
                stress_score=round(random.uniform(*stress_range), 1),
                mood_score=round(random.uniform(5.0, 8.5), 1),
                is_anomaly=False,
                is_synthetic=True
            ))

    session.add_all(peer_users)
    await session.flush()
    session.add_all(peer_spendings)
    session.add_all(peer_healths)
    await session.commit()
    print("-> Successfully seeded 500 peer users and cohorts.")
