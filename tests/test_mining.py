import pytest
from httpx import AsyncClient, ASGITransport
from apps.api.main import app

@pytest.mark.asyncio
async def test_mining_anomaly_detection():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/mining/anomaly?contamination=0.03")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert "anomalies" in data
        assert len(data["anomalies"]) > 0
        assert "metrics" in data
        assert data["metrics"]["anomaly_rate_pct"] > 0

@pytest.mark.asyncio
async def test_mining_peer_clustering():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/mining/clustering?n_clusters=4")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert len(data["personas"]) == 4
        assert "silhouette_score" in data["metrics"]
        assert data["metrics"]["silhouette_score"] > 0

@pytest.mark.asyncio
async def test_mining_association_rules():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/mining/association-rules?min_support=0.03&min_confidence=0.30")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] in ["success", "no_rules_found"]

@pytest.mark.asyncio
async def test_mining_forecasting():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/mining/forecast?months_ahead=6")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert len(data["forecast"]) == 6
        assert len(data["lower_80"]) == 6
        assert len(data["upper_80"]) == 6

@pytest.mark.asyncio
async def test_mining_goal_classifier():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/api/mining/goal-classifier")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["metrics"]["training_accuracy"] >= 0.70
        assert len(data["feature_importances"]) == 4
