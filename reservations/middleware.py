import logging
from django.utils.timezone import now

logger = logging.getLogger('audit')


class AuditLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated:
            if request.method in ['POST', 'PUT', 'DELETE']:
                logger.info(
                    f"[{now()}] User: {request.user.username} | "
                    f"Method: {request.method} | "
                    f"Path: {request.path} | "
                    f"Status: {response.status_code}"
                )

        return response