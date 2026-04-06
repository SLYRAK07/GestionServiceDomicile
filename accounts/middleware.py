from django.core.cache import cache
from django.http import JsonResponse

class BlocageCompteMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/api/token/' and request.method == 'POST':
            ip = request.META.get('REMOTE_ADDR')
            tentatives = cache.get(f'tentatives_{ip}', 0)

            if tentatives >= 5:
                return JsonResponse(
                    {'error': 'Compte bloqué temporairement. Réessayez dans 5 minutes.'},
                    status=403
                )

            response = self.get_response(request)

            if response.status_code == 401:
                cache.set(f'tentatives_{ip}', tentatives + 1, timeout=300)
            elif response.status_code == 200:
                cache.delete(f'tentatives_{ip}')

            return response

        return self.get_response(request)