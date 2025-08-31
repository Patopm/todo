import pytest
from rest_framework.test import APIClient
from apps.users.models import User


@pytest.fixture
def api_client():
    """API Client"""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Create user"""

    def make_user(**kwargs):
        return User.objects.create_user(**kwargs)

    return make_user


@pytest.fixture
def auth_client(api_client, create_user):
    """Auth client"""
    user = create_user(username="u1",
                       email="u1@example.com",
                       password="pass1234")
    resp = api_client.post("/api/auth/login/", {
        "username": user.username,
        "password": "pass1234"
    },
                           format="json")
    token = resp.data["access"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    api_client.user = user
    return api_client
