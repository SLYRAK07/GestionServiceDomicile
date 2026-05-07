from django.db import models
from django.conf import settings
from django.db.models import Avg

class Reservation(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('annulee', 'Annulée'),
        ('terminee', 'Terminée'),
        ('expiree', 'Expirée'),
        ('refusee', 'Refusée'),
    ]
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations_client')
    prestataire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations_prestataire', null=True, blank=True)
    date_reservation = models.DateTimeField(auto_now_add=True)
    date_service = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    adresse = models.TextField()

    def __str__(self):
        return f"Réservation {self.id} - {self.statut}"


class Avis(models.Model):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='avis_client')
    prestataire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='avis_prestataire', null=True, blank=True)
    reservation = models.OneToOneField(Reservation, on_delete=models.CASCADE)
    note = models.IntegerField()
    commentaire = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.calculer_moyenne_prestataire()

    def calculer_moyenne_prestataire(self):
        if self.prestataire:
            moyenne = Avis.objects.filter(
                prestataire=self.prestataire
            ).aggregate(Avg('note'))['note__avg']
            self.prestataire.note_moyenne = round(moyenne, 2) if moyenne else 0.0
            self.prestataire.save()

    def __str__(self):
        return f"Avis {self.note}/5 par {self.client}"