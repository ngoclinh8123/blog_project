import ast
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ....public.decorator import get_request_token


def authenticate_user(request):
    requestData = request.body.decode("utf-8")
    data = ast.literal_eval(requestData)
    user = authenticate(request, username=data["username"], password=data["password"])
    return user


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
    }


def get_refresh_token(request):
    request_data = request.body.decode("utf-8")
    data = ast.literal_eval(request_data)
    return data["refresh"]
