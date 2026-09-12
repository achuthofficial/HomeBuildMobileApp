"""Shared FastAPI dependencies."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel

from app.services.firebase import verify_id_token

bearer_scheme = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    uid: str
    email: str | None = None
    email_verified: bool = False
    claims: dict[str, Any] = {}


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> CurrentUser:
    """Resolve the caller from the ``Authorization: Bearer <firebase-id-token>`` header."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        claims = verify_id_token(credentials.credentials)
    except (firebase_auth.InvalidIdTokenError, ValueError) as exc:
        # Covers expired and revoked tokens too — both subclass
        # InvalidIdTokenError — plus malformed input, which raises ValueError.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    return CurrentUser(
        uid=claims["uid"],
        email=claims.get("email"),
        email_verified=bool(claims.get("email_verified", False)),
        claims=claims,
    )


CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]
