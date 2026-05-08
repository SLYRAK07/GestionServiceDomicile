from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            u = User.objects.create_superuser(
                username='admin',
                email='admin@admin.com',
                password='Admin1234!'
            )
            u.role = 'admin'
            u.save()
            self.stdout.write('Admin créé ✅')
        else:
            self.stdout.write('Admin existe déjà')