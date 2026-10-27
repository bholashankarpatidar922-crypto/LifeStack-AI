import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    BRAND_NAME: str = "LifeStack"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    FRONTEND_PORT: int = 5173
    
    # Security
    SECRET_KEY: str = "lifestack_super_secret_dev_key_change_in_production_min_32_chars"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./lifestack.db"
    
    # Vector Configuration
    VECTOR_BACKEND: str = "mock"  # 'mock' (numpy/sqlite) or 'pgvector'
    EMBEDDING_DIMENSION: int = 768
    
    # GenAI Provider: 'mock' | 'gemini' | 'claude' | 'openai'
    LLM_PROVIDER: str = "mock"
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # Storage
    STORAGE_BACKEND: str = "local"
    LOCAL_STORAGE_PATH: str = "./data/storage"
    GCS_BUCKET_NAME: Optional[str] = None
    
    # Push Notifications
    FCM_SERVER_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "capacitor://localhost"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
