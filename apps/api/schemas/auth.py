from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    demographic_cohort: Optional[str] = "early_career_tech"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str
    user_id: str
    email: str
    full_name: str
    role: str

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    mock_email: Optional[str] = None
    mock_name: Optional[str] = None
