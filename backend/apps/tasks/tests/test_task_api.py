import pytest
from rest_framework import status


@pytest.mark.django_db
def test_create_task(auth_client):
    data = {"title": "T1", "description": "Desc"}
    resp = auth_client.post("/api/tasks/", data, format="json")
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data["title"] == "T1"


@pytest.mark.django_db
def test_list_only_own_tasks(auth_client, create_user):
    # creamos una tarea para otro usuario
    other = create_user(username="u2",
                        email="u2@example.com",
                        password="pw2345")
    auth_client.post("/api/tasks/", {"title": "Mia"}, format="json")
    # fuerza creación de la de otro
    from apps.tasks.models import Task
    Task.objects.create(title="Otra", description="", responsible=other)

    resp = auth_client.get("/api/tasks/", format="json")
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.data) == 1


@pytest.mark.django_db
def test_update_and_delete(auth_client):
    # crea con el propio endpoint
    post = auth_client.post("/api/tasks/", {"title": "UpDel"}, format="json")
    tid = post.data["id"]

    # update
    url = f"/api/tasks/{tid}/"
    resp = auth_client.patch(url, {"status": "done"}, format="json")
    assert resp.status_code == status.HTTP_200_OK
    assert resp.data["status"] == "done"

    # delete
    resp2 = auth_client.delete(url)
    assert resp2.status_code == status.HTTP_204_NO_CONTENT
