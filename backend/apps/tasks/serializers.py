from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    responsible = serializers.HiddenField(
        default=serializers.CurrentUserDefault())

    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "status",
            "responsible",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
