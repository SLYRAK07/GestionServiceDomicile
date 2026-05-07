from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieViewSet, ServiceViewSet

router = DefaultRouter()
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'services', ServiceViewSet, basename='service')

urlpatterns = [
    path('', include(router.urls)),
]