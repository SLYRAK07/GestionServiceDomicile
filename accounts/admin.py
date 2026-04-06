from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# On personnalise l'affichage pour voir le champ 'role' dans la liste
class CustomUserAdmin(UserAdmin):
    model = User
    # Ajoute les nouveaux champs dans l'interface d'édition
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'telephone', 'adresse')}),
    )
    # Affiche le rôle dans la liste des utilisateurs
    list_display = ['username', 'email', 'role', 'is_staff']

admin.site.register(User, CustomUserAdmin)
