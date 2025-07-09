from django.db import models

# Create your models here.

class UserCred(models.Model):
    name = models.CharField(max_length = 20, blank = False)
    email = models.EmailField(max_length = 100, unique=True, blank = False)
    password = models.CharField(max_length = 100, blank = False)

    def __str__(self):
        return self.email

class TodoData(models.Model):
    STATUS_CHOICES = [
        ('in progress', 'In Progress'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200, blank=False)
    desc = models.TextField(blank=False)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, blank=False)

    def __str__(self):
        return f"{self.title} - {self.status}"