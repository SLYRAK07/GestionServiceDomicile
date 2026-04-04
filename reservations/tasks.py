from django.core.mail import send_mail
from django.conf import settings

def envoyer_email_reservation(statut, client_email, reservation_id):
    if statut == 'confirmee':
        sujet = 'Réservation confirmée ✅'
        message = f'Votre réservation #{reservation_id} a été confirmée avec succès !'
    elif statut == 'annulee':
        sujet = 'Réservation annulée ❌'
        message = f'Votre réservation #{reservation_id} a été annulée.'
    else:
        return

    send_mail(
        sujet,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [client_email],
        fail_silently=False,
    )