from rest_framework import serializers
from .models import Reservation, Avis
from django.utils import timezone


class ReservationSerializer(serializers.ModelSerializer):
    client = serializers.HiddenField(default=serializers.CurrentUserDefault())

    # AJOUTER CES DEUX LIGNES
    client_username = serializers.ReadOnlyField(source='client.username')
    service_nom = serializers.ReadOnlyField(source='service.nom')

    class Meta:
        model = Reservation
        fields = '__all__'
        # AJOUTER LES NOUVEAUX CHAMPS ICI
        read_only_fields = ['date_reservation', 'client_username', 'service_nom']


class AvisSerializer(serializers.ModelSerializer):
    client = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Avis
        fields = '__all__'
        read_only_fields = ['date', 'prestataire']

    def validate_note(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La note doit être entre 1 et 5")
        return value

    def validate(self, data):
        reservation = data.get('reservation')
        if reservation:
            # Accepter confirmee ET terminee
            if reservation.statut not in ['confirmee', 'terminee']:
                raise serializers.ValidationError(
                    "Vous ne pouvez noter qu'une réservation confirmée ou terminée."
                )
            if reservation.date_service > timezone.now():
                raise serializers.ValidationError(
                    "Vous ne pouvez noter qu'après la date du service."
                )
            if Avis.objects.filter(reservation=reservation).exists():
                raise serializers.ValidationError(
                    "Vous avez déjà laissé un avis pour cette réservation."
                )
        return data