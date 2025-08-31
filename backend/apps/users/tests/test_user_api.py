import pytest
from rest_framework import status


@pytest.mark.django_db
def test_register_user(api_client):
    data = {"username": "xx", "email": "xx@x.com", "password": "pw1234"}
    resp = api_client.post("/api/auth/", data, format="json")
    assert resp.status_code == status.HTTP_201_CREATED
    assert "id" in resp.data
    assert resp.data["username"] == "xx"


@pytest.mark.django_db
def test_login_returns_tokens(api_client, create_user):
    create_user(username="a1", email="a1@a.com", password="pw")
    resp = api_client.post("/api/auth/login/", {
        "username": "a1",
        "password": "pw"
    },
                           format="json")
    assert resp.status_code == status.HTTP_200_OK
    assert "access" in resp.data and "refresh" in resp.data
