"""Supabase client for server-side access.

This client uses the service-role key, so it bypasses row level security.
Treat every query here as privileged and scope it to the caller explicitly.
"""

from __future__ import annotations

from functools import lru_cache

from supabase import Client, create_client

from app.config import get_settings


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use Supabase."
        )
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
