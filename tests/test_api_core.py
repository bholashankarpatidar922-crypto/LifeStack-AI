import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from apps.api.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert data["brand"] == "LifeStack"

@pytest.mark.asyncio
async def test_login_demo_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.post("/api/auth/login", json={
            "email": "demo@lifestack.ai",
            "password": "Password123!"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["email"] == "demo@lifestack.ai"
        assert data["full_name"] == "Aarav Sharma"

@pytest.mark.asyncio
async def test_dashboard_summary():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # In debug mode without header, defaults to demo user
        resp = await ac.get("/api/dashboard/summary")
        assert resp.status_code == 200
        data = resp.json()
        assert "life_score" in data
        assert data["life_score"]["composite_score"] > 0
        assert "kpis" in data
        assert "spending_breakdown" in data
        assert len(data["spending_breakdown"]) > 0

@pytest.mark.asyncio
async def test_privacy_consents():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/privacy/consents")
        assert resp.status_code == 200
        data = resp.json()
        assert "consents" in data
        assert len(data["consents"]) >= 5
