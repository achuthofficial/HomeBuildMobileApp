"""Application settings, loaded from the environment (or a local .env file)."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "HomeBuild API"
    environment: str = "development"
    debug: bool = False

    # Origins allowed to call the API. Expo dev servers use these by default.
    cors_origins: list[str] = [
        "http://localhost:8081",
        "http://localhost:19006",
    ]

    # --- Firebase (Admin SDK) -------------------------------------------
    # Either point at a service-account JSON file, or paste the JSON itself
    # (handy on hosts that only offer environment variables). Leaving both
    # empty falls back to Application Default Credentials.
    firebase_project_id: str | None = None
    firebase_credentials_file: str | None = None
    firebase_credentials_json: str | None = None

    # --- Supabase --------------------------------------------------------
    # The service-role key bypasses row level security. It must never leave
    # the server — the mobile app uses the anon key instead.
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
