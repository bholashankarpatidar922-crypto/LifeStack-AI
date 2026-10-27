import os
import json
import uuid
import re
from datetime import datetime, date
from typing import Dict, Any, List, Tuple
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from apps.api.models.facts import FactSpending, FactHealth, FactAcademic, FactCareer
from apps.api.models.dimensions import DimTime, DimCategory
from apps.api.models.system import AuditLog

BRONZE_DIR = "./data/bronze"
os.makedirs(BRONZE_DIR, exist_ok=True)

# Intelligent merchant to category rules
MERCHANT_CATEGORY_RULES = {
    r"(swiggy|zomato|starbucks|third wave|truffles|mcdonald|subway|restaurant|cafe|dine|brew)": ("cat_dining", "Dining Out & Delivery"),
    r"(blinkit|zepto|instamart|bigbasket|supermarket|kirana|dmart|nature's basket|grocer)": ("cat_groceries", "Groceries & Supermarket"),
    r"(uber|ola|rapido|metro|petrol|shell|fuel|hpcl|bpcl|transit)": ("cat_transit", "Commute & Fuel"),
    r"(bescom|act fibernet|airtel|jio|electricity|water|wifi|broadband|bill)": ("cat_utilities", "Utilities & Bills"),
    r"(netflix|spotify|prime|hotstar|youtube|cinema|pvr|inox|bookmyshow)": ("cat_entertainment", "Streaming & Movies"),
    r"(cult\.fit|gym|fitness|sports|decathlon|yoga|swimming)": ("cat_fitness", "Gym & Sports"),
    r"(apollo|pharmeasy|1mg|hospital|clinic|doctor|pharmacy|meds)": ("cat_health", "Pharmacy & Medical"),
    r"(coursera|udemy|deeplearning|books|kindle|tuition|course)": ("cat_courses", "Courses & Books"),
    r"(apple|amazon|flipkart|croma|reliance digital|laptop|electronics)": ("cat_electronics", "Electronics & Tech"),
    r"(landlord|rent|housing|maintenance|nobroker)": ("cat_rent", "Rent & Housing"),
}

def detect_category(merchant_name: str) -> Tuple[str, str]:
    if not merchant_name:
        return ("cat_dining", "Dining Out & Delivery")
    lower = merchant_name.lower()
    for pattern, (cat_id, cat_name) in MERCHANT_CATEGORY_RULES.items():
        if re.search(pattern, lower):
            return (cat_id, cat_name)
    return ("cat_groceries", "Groceries & Supermarket")


def stage_bronze(user_id: str, domain: str, filename: str, content: str) -> str:
    """Bronze Layer: Store unedited raw ingestion payload."""
    batch_id = f"batch_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
    batch_path = os.path.join(BRONZE_DIR, f"{batch_id}.json")
    with open(batch_path, "w", encoding="utf-8") as f:
        json.dump({
            "batch_id": batch_id,
            "user_id": user_id,
            "domain": domain,
            "filename": filename,
            "staged_at": datetime.utcnow().isoformat(),
            "raw_content": content
        }, f, indent=2)
    return batch_id


def transform_silver_spending(raw_rows: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Silver Layer: Clean, cast types, normalize merchants, resolve categories."""
    clean_records = []
    errors = []

    for idx, row in enumerate(raw_rows):
        try:
            # Parse Date
            raw_date = row.get("date") or row.get("Date") or row.get("Txn Date") or row.get("transaction_date")
            if not raw_date:
                errors.append(f"Row {idx+1}: Missing date field.")
                continue
            
            parsed_date = pd.to_datetime(raw_date).date()

            # Parse Amount
            raw_amt = str(row.get("amount") or row.get("Amount") or row.get("Debit") or row.get("debit") or "0")
            cleaned_amt = float(re.sub(r"[^\d.]", "", raw_amt))
            if cleaned_amt <= 0:
                continue  # Skip zero or credit deposits in spending pipeline

            # Merchant & Category
            merchant = str(row.get("merchant") or row.get("Description") or row.get("Narration") or row.get("payee") or "Unknown Merchant").strip()
            cat_id, cat_name = detect_category(merchant)
            if "category" in row and row["category"]:
                cat_name = str(row["category"])

            clean_records.append({
                "date": parsed_date,
                "amount": cleaned_amt,
                "merchant": merchant,
                "category_id": cat_id,
                "category_name": cat_name,
                "payment_method": row.get("payment_method", "UPI")
            })
        except Exception as e:
            errors.append(f"Row {idx+1}: Failed to parse ({str(e)})")

    return clean_records, errors


async def load_gold_spending(session: AsyncSession, user_id: str, batch_id: str, silver_records: List[Dict[str, Any]]) -> int:
    """Gold Layer: Load into FactSpending with Star-Schema integrity."""
    count = 0
    facts = []

    for r in silver_records:
        d_key = int(r["date"].strftime("%Y%m%d"))
        fact = FactSpending(
            user_id=user_id,
            date_key=d_key,
            date=r["date"],
            amount=r["amount"],
            category_id=r["category_id"],
            category_name=r["category_name"],
            merchant=r["merchant"],
            payment_method=r.get("payment_method", "UPI"),
            source_id="src_hdfc_csv",
            is_anomaly=False,
            is_synthetic=False,
            notes=f"Ingested via ETL batch {batch_id}"
        )
        facts.append(fact)
        count += 1

    session.add_all(facts)
    
    # Audit log entry
    audit = AuditLog(
        user_id=user_id,
        action="data_ingest_gold",
        resource="fact_spending",
        details={"batch_id": batch_id, "rows_loaded": count}
    )
    session.add(audit)
    await session.commit()
    return count


async def rollback_gold_batch(session: AsyncSession, user_id: str, batch_id: str) -> int:
    """Rollback an ingested batch from the Gold warehouse."""
    stmt = delete(FactSpending).where(
        FactSpending.user_id == user_id,
        FactSpending.notes == f"Ingested via ETL batch {batch_id}"
    )
    res = await session.execute(stmt)
    await session.commit()
    return res.rowcount
