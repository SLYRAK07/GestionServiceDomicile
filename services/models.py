from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.db.models import Avg

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    icone = models.CharField(max_length=10, default='🔧')
    description = models.TextField(blank=True)

    def __str__(self):
        return self.nom


class Service(models.Model):
    prestataire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='services',
        limit_choices_to={'role': 'prestataire'}
    )
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.CASCADE,
        related_name='services'
    )
    titre = models.CharField(max_length=200)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    disponible = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def note_moyenne(self):
        from reservations.models import Avis
        moyenne = Avis.objects.filter(
            prestataire=self.prestataire
        ).aggregate(Avg('note'))['note__avg']
        return round(moyenne, 2) if moyenne else 0.0

    def __str__(self):
        return f"{self.titre} - {self.prestataire.username}"

    class Meta:
        ordering = ['-date_creation']