import pytest
from httpx import AsyncClient, ASGITransport
from apps.api.main import app

@pytest.mark.asyncio
async def test_copilot_grounded_rag_affordability():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.post("/api/copilot/chat", json={
            "message": "Can I afford this course EMI given my monthly surplus?"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "reply" in data
        assert "citations" in data
        assert len(data["citations"]) > 0
        assert data["confidence_score"] > 0.8
        assert "Disclaimer" in data["reply"]

@pytest.mark.asyncio
async def test_copilot_academic_career_decision():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.post("/api/copilot/chat", json={
            "message": "Should I choose CS or ECE given current placement trends and my GPA?"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "CSE" in data["reply"]
        assert len(data["citations"]) > 0

@pytest.mark.asyncio
async def test_copilot_refusal_on_missing_data():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.post("/api/copilot/chat", json={
            "message": "What was my pet penguin vet bill in Tokyo last winter?"
        })
        assert resp.status_code == 200
        data = resp.json()
        # Must refuse to guess when zero data is found
        assert data["confidence_score"] == 0.0 or "cannot find" in data["reply"].lower() or len(data["data_gaps"]) > 0

@pytest.mark.asyncio
async def test_monte_carlo_simulator():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.post("/api/copilot/simulate", json={
            "current_savings": 210000.0,
            "monthly_income": 112000.0,
            "base_burn_rate": 48500.0,
            "new_course_emi": 4200.0,
            "months_horizon": 12,
            "target_goal_amount": 500000.0
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["n_simulations"] == 1000
        assert "probability_of_success_pct" in data
        assert len(data["timeline_series"]) == 13
        assert "ai_narration" in data

@pytest.mark.asyncio
async def test_ocr_scanner():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        files = {"file": ("statement.csv", b"Date,Desc,Amt\n2026-10-01,Store,100", "text/csv")}
        resp = await ac.post("/api/copilot/ocr-scan", files=files)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert len(data["extracted_records"]) > 0
