from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrateur'),
        ('client', 'Client'),
        ('prestataire', 'Prestataire'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"



from django.db import models

# Create your models here.
