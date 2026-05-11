from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categorie, Service
from .serializers import CategorieSerializer, ServiceSerializer
from .ia import meilleur_par_categorie



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
        if self.action in ['list', 'retrieve', 'par_note', 'par_categorie']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        # Admin voit tout
        if user.is_authenticated and hasattr(user, 'role') and user.role == 'admin':
            statut = self.request.query_params.get('statut')
            if statut:
                return Service.objects.filter(statut=statut)
            return Service.objects.all()

        # Prestataire voit ses propres services
        if user.is_authenticated and hasattr(user, 'role') and user.role == 'prestataire':
            return Service.objects.filter(prestataire=user)

        # Clients et visiteurs voient uniquement les services approuvés et disponibles
        queryset = Service.objects.filter(disponible=True, statut='approuve')
        categorie_id = self.request.query_params.get('categorie')
        if categorie_id:
            queryset = queryset.filter(categorie_id=categorie_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(prestataire=self.request.user, statut='en_attente')

    @action(detail=False, methods=['get'])
    def par_note(self, request):
        services = Service.objects.filter(disponible=True, statut='approuve')
        services_tries = sorted(services, key=lambda s: s.note_moyenne(), reverse=True)
        serializer = self.get_serializer(services_tries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def par_categorie(self, request):
        categorie_id = request.query_params.get('categorie_id')
        services = Service.objects.filter(disponible=True, statut='approuve', categorie_id=categorie_id)
        services_tries = sorted(services, key=lambda s: s.note_moyenne(), reverse=True)
        serializer = self.get_serializer(services_tries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='mes-services')
    def mes_services(self, request):
        """Retourne les services du prestataire connecté avec leur statut"""
        if not request.user.is_authenticated or request.user.role != 'prestataire':
            return Response({'error': 'Non autorisé'}, status=403)
        services = Service.objects.filter(prestataire=request.user)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approuver(self, request, pk=None):
        """Admin approuve un service"""
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'error': 'Non autorisé'}, status=403)
        service = self.get_object()
        service.statut = 'approuve'
        service.save()
        return Response({'message': 'Service approuvé ✅'})

    @action(detail=True, methods=['post'])
    def refuser(self, request, pk=None):
        """Admin refuse un service"""
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'error': 'Non autorisé'}, status=403)
        service = self.get_object()
        service.statut = 'refuse'
        service.save()
        return Response({'message': 'Service refusé'})


    @action(detail=False, methods=['get'])
    def recommandations(self, request):
        services = meilleur_par_categorie()
        serializer = self.get_serializer(services, many=True)
        data = serializer.data
        for i, s in enumerate(services):
            data[i]['score_ia'] = s.score_ia
        return Response(data)