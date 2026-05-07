from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categorie, Service
from .serializers import CategorieSerializer, ServiceSerializer

class CategorieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [AllowAny]


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['titre', 'description', 'categorie__nom']
    ordering_fields = ['prix', 'date_creation']
    ordering = ['-date_creation']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Service.objects.filter(disponible=True)
        categorie_id = self.request.query_params.get('categorie')
        if categorie_id:
            queryset = queryset.filter(categorie_id=categorie_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(prestataire=self.request.user)

    @action(detail=False, methods=['get'])
    def par_note(self, request):
        services = Service.objects.filter(disponible=True)
        services_tries = sorted(
            services,
            key=lambda s: s.note_moyenne(),
            reverse=True
        )
        serializer = self.get_serializer(services_tries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def par_categorie(self, request):
        categorie_id = request.query_params.get('categorie_id')
        services = Service.objects.filter(
            disponible=True,
            categorie_id=categorie_id
        )
        services_tries = sorted(
            services,
            key=lambda s: s.note_moyenne(),
            reverse=True
        )
        serializer = self.get_serializer(services_tries, many=True)
        return Response(serializer.data)