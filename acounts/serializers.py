from rest_framework import serializers
from .models import User

class AcountsSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # On inclut tous les champs que tu as créés
        fields = ['id', 'username', 'email', 'password', 'role', 'telephone', 'adresse']

    def create(self, validated_data):
        # Utilise create_user pour hacher (crypter) le mot de passe automatiquement
        user = User.objects.create_user(**validated_data)
        return user