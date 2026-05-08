from django.core.mail import send_mail, get_connection
from django.conf import settings


def envoyer_email_reservation(type_action, email_destinataire, reservation_id, nom_destinataire='', nom_autre=''):
    sujets = {
        'nouvelle': f"🔔 Nouvelle demande de service ServiHome #{reservation_id}",
        'nouvelle_client': f"✅ Votre demande ServiHome #{reservation_id} a été envoyée !",
        'confirmee': f"🎉 Votre réservation ServiHome #{reservation_id} est confirmée !",
        'annulee': f"❌ Annulation de la réservation ServiHome #{reservation_id}",
        'refusee': f"❌ Réservation ServiHome #{reservation_id} refusée",
        'expiree': f"⏰ Demande ServiHome #{reservation_id} expirée automatiquement",
    }

    messages = {
        'nouvelle': f"Bonjour {nom_destinataire},\n\nVous avez reçu une nouvelle demande de service de la part de {nom_autre} sur ServiHome.\n\nConnectez-vous à votre espace prestataire pour confirmer ou refuser cette demande.\n\n— L'équipe ServiHome",
        'nouvelle_client': f"Bonjour {nom_destinataire},\n\nVotre demande de service a bien été envoyée au prestataire {nom_autre}.\n\nVous recevrez un email dès qu'il aura répondu.\n\n— L'équipe ServiHome",
        'confirmee': f"Bonjour {nom_destinataire},\n\nBonne nouvelle ! Votre réservation #{reservation_id} a été confirmée par le prestataire {nom_autre}.\n\nPréparez-vous pour la date convenue.\n\n— L'équipe ServiHome",
        'annulee': f"Bonjour {nom_destinataire},\n\nLa réservation #{reservation_id} a été annulée.\n\nVous pouvez consulter d'autres prestataires sur notre plateforme.\n\n— L'équipe ServiHome",
        'refusee': f"Bonjour {nom_destinataire},\n\nDésolé, votre demande #{reservation_id} a été refusée par le prestataire {nom_autre}.\n\nVous pouvez consulter d'autres prestataires sur notre plateforme.\n\n— L'équipe ServiHome",
        'expiree': f"Bonjour {nom_destinataire},\n\nVotre demande #{reservation_id} n'a pas reçu de réponse avant la date prévue et a été annulée automatiquement.\n\nVous pouvez faire une nouvelle demande sur ServiHome.\n\n— L'équipe ServiHome",
    }

    try:
        connection = get_connection(timeout=5)
        send_mail(
            subject=sujets.get(type_action, "Mise à jour ServiHome"),
            message=messages.get(type_action, ""),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email_destinataire],
            connection=connection,
            fail_silently=True,
        )
        print(f"Email envoyé ✅ à {email_destinataire}")
    except Exception as e:
        print(f"Erreur email: {e}")