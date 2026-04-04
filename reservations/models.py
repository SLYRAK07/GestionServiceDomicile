from django.db import models
from django.conf import settings

class Reservation(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('annulee', 'Annulée'),
        ('terminee', 'Terminée'),
    ]

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations_client')
    date_reservation = models.DateTimeField(auto_now_add=True)
    date_service = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    adresse = models.TextField()

    def __str__(self):
        return f"Réservation {self.id} - {self.statut}"


class Avis(models.Model):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reservation = models.OneToOneField(Reservation, on_delete=models.CASCADE)
    note = models.IntegerField()
    commentaire = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    # TODO: calculer moyenne prestataire

    def __str__(self):
        return f"Avis {self.note}/5 par {self.client}"