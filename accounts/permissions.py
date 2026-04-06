from rest_framework import permissions

class IsPrestataire(permissions.BasePermission):
    """Permet l'accès uniquement aux utilisateurs ayant le rôle 'prestataire'."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'prestataire')

class IsClient(permissions.BasePermission):
    """Permet l'accès uniquement aux utilisateurs ayant le rôle 'client'."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'client')