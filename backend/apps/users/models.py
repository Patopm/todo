from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField('Correo electrónico', unique=True)

    def __str__(self):
        return self.username
