from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Reservation, Avis
from .serializers import ReservationSerializer, AvisSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'])
    def confirmer(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'confirmee'
        reservation.save()
        return Response({'message': 'Réservation confirmée'})

    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        reservation = self.get_object()
        reservation.statut = 'annulee'
        reservation.save()
        return Response({'message': 'Réservation annulée'})


class AvisViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AvisSerializer

    def get_queryset(self):
        return Avis.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)