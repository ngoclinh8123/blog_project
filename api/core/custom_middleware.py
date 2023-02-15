from rest_framework import status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from apps.auth.basic_auth.models import User


class RequiredCheckTokenSignature:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.META.get("HTTP_AUTHORIZATION", " ").split(" ")[1]
        if token != "":
            signature = token.split(".")[-1]
            user = User.objects.filter(token_signature=signature)
            if not user.count() > 0:
                response = Response(
                    data="vui long dang nhap lai", status=status.HTTP_400_BAD_REQUEST
                )
                response.accepted_renderer = JSONRenderer()
                response.accepted_media_type = "application/json"
                response.renderer_context = {}
                response.render()
                return response
        response = self.get_response(request)
        return response
