from django.utils.translation import gettext
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer


class RequiredCheckTokenSignature:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        allow_path = (
            "/api/v1/auth/token/",
            "/api/v1/auth/token/refresh/",
            "/api/v1/auth/forgot_password/",
            "/api/v1/auth/logout/",
            "/api/v1/auth/reset_password/",
        )
        if request.path_info not in allow_path:
            token = request.COOKIES.get("token", "")
            if token != "":
                authorization = f"JWT {token}"
                request.META["HTTP_AUTHORIZATION"] = authorization
                signature = token.split(".")[-1]
                User = get_user_model()
                if not User.objects.filter(token_signature=signature).count() > 0:
                    print("loi o day")
                    message = gettext("Please login again.")
                    response = Response(
                        data=message, status=status.HTTP_400_BAD_REQUEST
                    )
                    response.accepted_renderer = JSONRenderer()
                    response.accepted_media_type = "application/json"
                    response.renderer_context = {}
                    response.render()
                    return response
        response = self.get_response(request)
        return response
