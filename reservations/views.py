from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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
        return Reservation.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)

    @action(detail=True, methods=['post'])
    def confirmer(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'confirmee'
        reservation.save()
        envoyer_email_reservation('confirmee', reservation.client.email, reservation.id)
        return Response({'message': 'Réservation confirmée'})

    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'annulee'
        reservation.save()
        envoyer_email_reservation('annulee', reservation.client.email, reservation.id)
        return Response({'message': 'Réservation annulée'})


class AvisViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AvisSerializer

    def get_queryset(self):
        return Avis.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)