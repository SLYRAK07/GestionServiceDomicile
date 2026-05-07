from rest_framework import serializers
from .models import Categorie, Service
from accounts.models import User

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'


class PrestatireSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'telephone', 'adresse', 'note_moyenne']


class ServiceSerializer(serializers.ModelSerializer):
    prestataire = PrestatireSerializer(read_only=True)
    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all(),
        source='categorie',
        write_only=True
    )
    note_moyenne = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'titre', 'description', 'prix',
            'disponible', 'date_creation',
            'prestataire', 'categorie', 'categorie_id',
            'note_moyenne'
        ]
        read_only_fields = ['prestataire', 'date_creation']

    def get_note_moyenne(self, obj):
        return obj.note_moyenne()