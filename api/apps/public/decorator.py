from functools import wraps
from rest_framework import status
from rest_framework.response import Response

from ..auth.basic_auth.models import User


def get_request_token(request):
    try:
        token = request.META.get("HTTP_AUTHORIZATION", " ").split(" ")[1]
        return token
    except:
        return ""


def requires_check_token_signature(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        _request = args[0]
        token = get_request_token(_request)
        if token != "":
            tokenSignature = token.split(".")[-1]
            if User.objects.filter(token_signature=tokenSignature).exists():
                return view_func(request, *args, **kwargs)
            return Response("vui long dang nhap lai")
        return view_func(request, *args, **kwargs)

    return wrapper
