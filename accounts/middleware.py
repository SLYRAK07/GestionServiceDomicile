from django.core.cache import cache
from django.http import JsonResponse


class BlocageCompteMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # On vérifie si l'URL contient 'login' ou 'token' pour être sûr de l'intercepter
        if ('login' in request.path or 'token' in request.path) and request.method == 'POST':
            ip = request.META.get('REMOTE_ADDR')

            # Debugging : affiche l'IP dans ton terminal Django
            tentatives = cache.get(f'tentatives_{ip}', 0)
            print(f"--- SÉCURITÉ --- IP: {ip} | Tentatives: {tentatives}")

            if tentatives >= 5:
                return JsonResponse(
                    {'error': 'Compte bloqué temporairement. Réessayez dans 5 minutes.'},
                    status=403
                )

            response = self.get_response(request)

            # SimpleJWT renvoie 401 en cas de mauvais identifiants
            if response.status_code == 401:
                new_total = tentatives + 1
                cache.set(f'tentatives_{ip}', new_total, timeout=300)
                print(f"ÉCHEC : Nouveau total pour {ip} = {new_total}")

            # Si succès, on nettoie le cache pour cette IP
            elif response.status_code == 200:
                cache.delete(f'tentatives_{ip}')
                print(f"SUCCÈS : Compteur réinitialisé pour {ip}")

            return response

        return self.get_response(request)