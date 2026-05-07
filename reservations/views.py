from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Reservation, Avis
from .serializers import ReservationSerializer, AvisSerializer
from .tasks import envoyer_email_reservation
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

@method_decorator(ratelimit(key='user', rate='10/m', method='POST', block=True), name='create')
class ReservationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'prestataire':
            return Reservation.objects.filter(prestataire=user)
        return Reservation.objects.filter(client=user)






    def perform_create(self, serializer):
        reservation = serializer.save(client=self.request.user)
        if reservation.prestataire:
            envoyer_email_reservation.delay(
                'nouvelle',
                reservation.prestataire.email,
                reservation.id,
                nom_destinataire=reservation.prestataire.username,
                nom_autre=reservation.client.username
            )
        envoyer_email_reservation.delay(
            'nouvelle_client',
            reservation.client.email,
            reservation.id,
            nom_destinataire=reservation.client.username,
            nom_autre=reservation.prestataire.username if reservation.prestataire else 'le prestataire'
        )



    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        now = timezone.now()

        # Utiliser Reservation.objects directement pour attraper TOUTES les expirées
        # peu importe le rôle de l'utilisateur connecté
        Reservation.objects.filter(
            statut='confirmee',
            date_service__lt=now
        ).update(statut='terminee')

        expirees = Reservation.objects.filter(
            statut='en_attente',
            date_service__lt=now
        )
        for reservation in expirees:
            reservation.statut = 'expiree'
            reservation.save()
            envoyer_email_reservation.delay(
                'expiree',
                reservation.client.email,
                reservation.id,
                nom_destinataire=reservation.client.username,
            )
            if reservation.prestataire:
                envoyer_email_reservation.delay(
                    'expiree',
                    reservation.prestataire.email,
                    reservation.id,
                    nom_destinataire=reservation.prestataire.username,
                )

        return super().list(request, *args, **kwargs)


    #Action:Confirmer
    @action(detail=True, methods=['post'])
    def confirmer(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'confirmee'
        reservation.save()
        envoyer_email_reservation.delay(
            'confirmee',
            reservation.client.email,
            reservation.id,
            nom_destinataire=reservation.client.username,
            nom_autre=reservation.prestataire.username if reservation.prestataire else 'le prestataire'
        )
        return Response({'message': 'Réservation confirmée'})



    #Action:Refus
    @action(detail=True, methods=['post'])
    def refuser(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'refusee'
        reservation.save()
        envoyer_email_reservation.delay(
            'refusee',
            reservation.client.email,
            reservation.id,
            nom_destinataire=reservation.client.username,
            nom_autre=reservation.prestataire.username if reservation.prestataire else 'le prestataire'
        )
        return Response({'message': 'Réservation refusée'})


#action : annulee
    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'annulee'
        reservation.save()
        envoyer_email_reservation.delay(
            'annulee',
            reservation.client.email,
            reservation.id,
            nom_destinataire=reservation.client.username,
            nom_autre=reservation.prestataire.username if reservation.prestataire else 'le prestataire'
        )
        if reservation.prestataire:
            envoyer_email_reservation.delay(
                'annulee',
                reservation.prestataire.email,
                reservation.id,
                nom_destinataire=reservation.prestataire.username,
                nom_autre=reservation.client.username
            )
        return Response({'message': 'Réservation annulée'})



    @action(detail=True, methods=['get'])
    def peut_noter(self, request, pk=None):
        reservation = self.get_object()

        # Vérifier si déjà noté
        deja_note = Avis.objects.filter(reservation=reservation).exists()
        if deja_note:
            return Response({
                'peut_noter': False,
                'message': 'Vous avez déjà laissé un avis pour cette réservation.'
            })

        # Vérifier statut terminée
        if reservation.statut != 'terminee':
            return Response({
                'peut_noter': False,
                'message': 'Vous ne pouvez noter qu\'une réservation terminée.'
            })

        return Response({
            'peut_noter': True,
            'message': 'Vous pouvez laisser un avis.'
        })


class AvisViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AvisSerializer

    def get_queryset(self):
        return Avis.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        reservation = serializer.validated_data.get('reservation')
        serializer.save(
            client=self.request.user,
            prestataire=reservation.prestataire if reservation else None
        )

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)