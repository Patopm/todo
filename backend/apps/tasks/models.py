# apps/tasks/models.py
from django.conf import settings
from django.db import models


class Task(models.Model):
    STATUS_TODO = 'todo'
    STATUS_DONE = 'done'

    STATUS_CHOICES = [
        (STATUS_TODO, 'To Do'),
        (STATUS_DONE, 'Done'),
    ]

    title = models.CharField('Título', max_length=255)
    description = models.TextField('Descripción', blank=True)
    status = models.CharField('Estado',
                              max_length=10,
                              choices=STATUS_CHOICES,
                              default=STATUS_TODO)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL,
                                    related_name='tasks',
                                    on_delete=models.CASCADE)
    created_at = models.DateTimeField('Creado el', auto_now_add=True)
    updated_at = models.DateTimeField('Actualizado el', auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Tarea'
        verbose_name_plural = 'Tareas'

    def __str__(self):
        return f'{self.title} ({self.get_status_display()})'
