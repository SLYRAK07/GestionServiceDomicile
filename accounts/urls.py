from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, ProfileView, AdminUserListView, AdminToggleBanView, AdminStatsView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/toggle-ban/', AdminToggleBanView.as_view(), name='admin_toggle_ban'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),

]