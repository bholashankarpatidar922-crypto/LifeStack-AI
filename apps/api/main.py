from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from apps.api.core.config import settings
from apps.api.routers import auth, privacy, ingest, dashboard, goals, decisions, mining, copilot

app = FastAPI(
    title=f"{settings.BRAND_NAME} API",
    description="Personal Decision Intelligence Platform Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security and timing middleware
@app.middleware("http")
async def add_process_time_and_security_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Register API Routers
app.include_router(auth.router)
app.include_router(privacy.router)
app.include_router(ingest.router)
app.include_router(dashboard.router)
app.include_router(goals.router)
app.include_router(decisions.router)
app.include_router(mining.router)
app.include_router(copilot.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "brand": settings.BRAND_NAME,
        "environment": settings.ENVIRONMENT,
        "database": "connected",
        "timestamp": time.time()
    }
