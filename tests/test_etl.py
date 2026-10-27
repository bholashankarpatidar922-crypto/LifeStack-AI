import pytest
from datetime import date
from pipelines.etl_engine import detect_category, transform_silver_spending

def test_detect_category():
    assert detect_category("Swiggy")[0] == "cat_dining"
    assert detect_category("Zomato Daily")[0] == "cat_dining"
    assert detect_category("Blinkit Commerce")[0] == "cat_groceries"
    assert detect_category("Uber India")[0] == "cat_transit"
    assert detect_category("BESCOM Electricity")[0] == "cat_utilities"
    assert detect_category("Cult.fit Fitness")[0] == "cat_fitness"

def test_transform_silver_spending():
    raw_data = [
        {"Txn Date": "2026-10-01", "Description": "Swiggy Bangalore", "Debit": "450.50"},
        {"Txn Date": "2026-10-02", "Description": "Bescom Bill", "Debit": "2100.00"},
        {"Txn Date": "2026-10-03", "Description": "Refund Credit", "Debit": "0.00"},  # Should be skipped
    ]
    clean_records, errors = transform_silver_spending(raw_data)
    assert len(clean_records) == 2
    assert clean_records[0]["amount"] == 450.50
    assert clean_records[0]["category_id"] == "cat_dining"
    assert clean_records[1]["amount"] == 2100.00
    assert clean_records[1]["category_id"] == "cat_utilities"
