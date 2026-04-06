from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    # Le mot de passe ne doit être envoyé que lors de la création (jamais renvoyé par l'API)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'telephone', 'adresse']

    def create(self, validated_data):
        # IMPORTANT : create_user hache le mot de passe automatiquement pour la sécurité
        user = User.objects.create_user(**validated_data)
        return user