from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from apps.api.core.config import settings
from apps.api.core.database import get_db
from apps.api.models.dimensions import DimUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)

async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[DimUser]:
    if not token:
        # Check for demo default fallback if in debug mode
        if settings.DEBUG:
            demo_user = await db.get(DimUser, "00000000-0000-0000-0000-000000000001")
            return demo_user
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None

    user = await db.get(DimUser, user_id)
    return user

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> DimUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        # Fallback to demo user during development/testing
        if settings.DEBUG:
            demo_user = await db.get(DimUser, "00000000-0000-0000-0000-000000000001")
            if demo_user:
                return demo_user
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await db.get(DimUser, user_id)
    if user is None or not user.is_active:
        raise credentials_exception
    return user
