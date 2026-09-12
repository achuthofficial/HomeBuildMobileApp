from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.deps import CurrentUser, get_current_user
from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def authed_client() -> Iterator[TestClient]:
    """Client with Firebase token verification stubbed out."""
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        uid="test-uid", email="test@example.com", email_verified=True
    )
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
