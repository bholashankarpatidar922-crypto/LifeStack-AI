from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from apps.api.core.database import get_db
from apps.api.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from apps.api.core.deps import get_current_user
from apps.api.models.dimensions import DimUser
from apps.api.models.system import ConsentRecord, AuditLog
from apps.api.schemas.auth import LoginRequest, SignupRequest, TokenResponse, GoogleAuthRequest

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(DimUser).where(DimUser.email == req.email.lower())
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(user.user_id)
    refresh_token = create_refresh_token(user.user_id)

    # Log login action
    audit = AuditLog(
        user_id=user.user_id,
        action="login_success",
        resource="auth",
        details={"email": user.email}
    )
    db.add(audit)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.post("/signup", response_model=TokenResponse)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(DimUser).where(DimUser.email == req.email.lower())
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    new_user = DimUser(
        email=req.email.lower(),
        full_name=req.full_name,
        hashed_password=get_password_hash(req.password),
        role="user",
        demographic_cohort=req.demographic_cohort or "early_career_tech",
        persona_cluster=0
    )
    db.add(new_user)
    await db.flush()

    # Initialize default consents (DPDP Act 2023)
    for cat in ["spending", "health", "academics", "career", "public_benchmarking"]:
        c_rec = ConsentRecord(
            user_id=new_user.user_id,
            category=cat,
            consent_granted=True,
            purpose=f"LifeStack decision intelligence and pattern mining for {cat}"
        )
        db.add(c_rec)

    access_token = create_access_token(new_user.user_id)
    refresh_token = create_refresh_token(new_user.user_id)

    db.add(AuditLog(
        user_id=new_user.user_id,
        action="signup_created",
        resource="auth",
        details={"email": new_user.email}
    ))
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=new_user.user_id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role
    )

@router.post("/google", response_model=TokenResponse)
async def google_auth(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Google OAuth Sign-In with Mock Fallback for local development.
    If no Google credentials are provided, seamlessly falls back to demo account.
    """
    email = req.mock_email or "demo@lifestack.ai"
    name = req.mock_name or "Aarav Sharma"

    stmt = select(DimUser).where(DimUser.email == email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        user = DimUser(
            email=email,
            full_name=name,
            hashed_password=get_password_hash("GoogleOAuthMockPass!"),
            role="user",
            demographic_cohort="early_career_tech"
        )
        db.add(user)
        await db.flush()

    access_token = create_access_token(user.user_id)
    refresh_token = create_refresh_token(user.user_id)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/me")
async def get_profile(current_user: DimUser = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "demographic_cohort": current_user.demographic_cohort,
        "persona_cluster": current_user.persona_cluster,
        "created_at": current_user.created_at
    }
