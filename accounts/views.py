from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from .serializers import UserSerializer,UserUpdateSerializer
from .models import User
from .permissions import IsPrestataire

# --- LOGIQUE DE LOGIN (JWT avec retour du User) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # On appelle la validation parente (qui vérifie username/password)
        data = super().validate(attrs)

        # --- VERIFICATION DU BLACKLISTAGE ---
        # Django utilise 'is_active' par défaut pour bannir.
        if not self.user.is_active:
            raise serializers.ValidationError(
                {"detail": "Ce compte a été banni par l'administrateur."}
            )

        # Si tout est bon, on ajoute les infos pour React
        data['user'] = {
            'username': self.user.username,
            'email': self.user.email,
            'role': getattr(self.user, 'role', 'client'),
            'is_active': self.user.is_active
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]

# --- LOGIQUE D'INSCRIPTION ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "Bienvenue chez ServiHome !",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- LOGIQUE DE LISTE (C'est ce qui débloque ta Home) ---
class UserListView(generics.ListAPIView):
    """
    Renvoie la liste des utilisateurs.
    Utilisé pour afficher les experts les mieux notés sur la Home.
    """
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # On ne montre QUE les utilisateurs actifs
        queryset = User.objects.filter(is_active=True)
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role).order_by('-note_moyenne')
        return queryset

    def get_queryset(self):
        queryset = User.objects.all()
        # On récupère le paramètre ?role=prestataire envoyé par React
        role = self.request.query_params.get('role')
        if role:
            # On filtre par rôle et on trie par note_moyenne (décroissant)
            queryset = queryset.filter(role=role).order_by('-note_moyenne')
        return queryset


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user



#admin

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        role = self.request.query_params.get('role')
        queryset = User.objects.all().order_by('-note_moyenne')
        if role:
            queryset = queryset.filter(role=role)
        return queryset


class AdminToggleBanView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Non autorisé'}, status=403)
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            statut = 'activé' if user.is_active else 'banni'
            return Response({'message': f'Compte {statut}', 'is_active': user.is_active})
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur introuvable'}, status=404)


class AdminStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Non autorisé'}, status=403)

        from reservations.models import Reservation

        stats = {
            'total_clients': User.objects.filter(role='client').count(),
            'total_prestataires': User.objects.filter(role='prestataire').count(),
            'total_reservations': Reservation.objects.count(),
            'reservations_en_attente': Reservation.objects.filter(statut='en_attente').count(),
            'reservations_confirmees': Reservation.objects.filter(statut='confirmee').count(),
            'reservations_terminees': Reservation.objects.filter(statut='terminee').count(),
            'reservations_annulees': Reservation.objects.filter(statut='annulee').count(),
        }
        return Response(stats)




# --- LOGIQUE PRESTATAIRE ---
class CreateServiceView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsPrestataire]
    # Ta logique pour ajouter un service à ton catalogue ici...


class TokenRefreshView:
    pass