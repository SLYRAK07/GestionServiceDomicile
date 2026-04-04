from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReservationViewSet, AvisViewSet

router = DefaultRouter()
router.register(r'reservations', ReservationViewSet, basename='reservation')
router.register(r'avis', AvisViewSet, basename='avis')

urlpatterns = [
    path('', include(router.urls)),
]