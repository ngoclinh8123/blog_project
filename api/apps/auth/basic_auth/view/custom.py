from django.shortcuts import get_object_or_404
from django.contrib.auth import login
from django.utils.translation import gettext
from rest_framework import status
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.auth.basic_auth.models import User
from apps.auth.basic_auth.helper.sr import ChangePasswordSr
from apps.auth.basic_auth.helper.util import Util
from apps.public.models import CustomResponse


class Login(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        user = Util.authenticate_user(request)
        if user is not None:
            login(request, user)
            token = Util.get_tokens_for_user(user)
            token_signature = token["access"].split(".")[-1]
            User.objects.filter(username=user.username).update(token_signature=token_signature)
            message = gettext("Login successfully.")
            return CustomResponse.success_response(self, message, token)
        message = gettext("Account does not exist.")
        return CustomResponse.fail_response(self, message)


class TokenRefresh(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        refresh_token = Util.get_refresh_token(request)
        old_token_signature = refresh_token.split(".")[-1]
        user = get_object_or_404(User, token_signature=old_token_signature)
        token = Util.get_tokens_for_user(user)
        new_token_signature = token["access"].split(".")[-1]

        User.objects.filter(token_signature=old_token_signature).update(
            token_signature=new_token_signature
        )
        message = gettext("Refresh token successfully.")
        return CustomResponse.success_response(self, message, token)


class ChangePassword(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def update(self, request):
        serializer = ChangePasswordSr(data=request.data)
        user = request.user
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                message = gettext("Wrong password.")
                return CustomResponse.success_response(self, message)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            message = gettext("Changed password successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Changed password failed.")
        return CustomResponse.fail_response(self, message)


class Logout(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        User.objects.filter(username=request.user.username).update(token_signature="")
        message = gettext("Logout successfully.")
        return CustomResponse.success_response(self, message)
