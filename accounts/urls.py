from django.urls import path
from .views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]
from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # C'est ici que l'utilisateur envoie son login/password pour recevoir ses Tokens
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # C'est ici qu'on renouvelle la clé quand elle expire
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]