from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "Utilisateur créé avec succès",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from .permissions import IsPrestataire
from rest_framework.permissions import IsAuthenticated

class CreateServiceView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsPrestataire] # 1. Doit être connecté + 2. Doit être prestataire
    # ... le reste du code