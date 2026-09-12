"""Firebase Admin SDK wiring.

The Admin SDK is used server-side to verify the ID tokens the mobile app sends
and to reach Firestore / Cloud Messaging with elevated privileges.
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from typing import Any

import firebase_admin
from firebase_admin import auth, credentials, firestore

from app.config import get_settings

logger = logging.getLogger(__name__)


def _build_credentials() -> credentials.Base | None:
    settings = get_settings()

    if settings.firebase_credentials_json:
        return credentials.Certificate(json.loads(settings.firebase_credentials_json))
    if settings.firebase_credentials_file:
        return credentials.Certificate(settings.firebase_credentials_file)
    return None


@lru_cache
def get_firebase_app() -> firebase_admin.App:
    """Initialise (once) and return the default Firebase app."""
    try:
        return firebase_admin.get_app()
    except ValueError:
        pass

    cred = _build_credentials()
    options: dict[str, Any] = {}
    if get_settings().firebase_project_id:
        options["projectId"] = get_settings().firebase_project_id

    # Without explicit credentials the SDK falls back to Application Default
    # Credentials, which is the right thing on Google Cloud runtimes.
    return firebase_admin.initialize_app(cred, options or None)


def verify_id_token(token: str) -> dict[str, Any]:
    """Verify a Firebase ID token and return its decoded claims.

    Raises ``firebase_admin.auth.InvalidIdTokenError`` (and friends) when the
    token is malformed, expired or revoked.
    """
    return auth.verify_id_token(token, app=get_firebase_app(), check_revoked=False)


def get_firestore_client() -> firestore.Client:
    return firestore.client(app=get_firebase_app())
