"""HomeBuild API — FastAPI backend for the Expo mobile app."""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import health, projects

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    if not settings.supabase_url:
        logger.warning("SUPABASE_URL is not set — Supabase-backed routes will fail.")
    if not (settings.firebase_credentials_file or settings.firebase_credentials_json):
        logger.warning(
            "No Firebase service-account credentials set — falling back to "
            "Application Default Credentials for token verification."
        )
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(projects.router)
    return app


app = create_app()
