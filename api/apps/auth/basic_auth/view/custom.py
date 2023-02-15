from django.shortcuts import get_object_or_404
from django.contrib.auth import login

from rest_framework import status
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import User
from ..helper.sr import ChangePasswordSr
from ..helper.util import (
    authenticate_user,
    get_tokens_for_user,
    get_refresh_token,
)
from ....public.models import CustomResponse
from ....public.decorator import requires_check_token_signature


class Login(APIView):
    _model_class = User
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        user = authenticate_user(request)
        if user is not None:
            login(request, user)
            token = get_tokens_for_user(user)
            token_signature = token["access"].split(".")[-1]
            self._model_class.objects.filter(username=user.username).update(
                token_signature=token_signature
            )
            return CustomResponse.data(self, token)
        return CustomResponse.fail(self, "tài khoản không tồn tại")


class TokenRefresh(APIView):
    _model_class = User
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        refresh_token = get_refresh_token(request)
        old_token_signature = refresh_token.split(".")[-1]
        user = get_object_or_404(self._model_class, token_signature=old_token_signature)
        token = get_tokens_for_user(user)
        new_token_signature = token["access"].split(".")[-1]

        self._model_class.objects.filter(token_signature=old_token_signature).update(
            token_signature=new_token_signature
        )
        return CustomResponse.data(self, token)


class ChangePassword(generics.UpdateAPIView):
    _model_class = User
    _serializer_class = ChangePasswordSr
    permission_classes = (permissions.IsAuthenticated,)

    @requires_check_token_signature
    def update(self, request):
        serializer = self._serializer_class(data=request.data)
        user = request.user
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return CustomResponse.fail(self, "wrong password")
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)


class Logout(APIView):
    _model_class = User
    permission_classes = (permissions.IsAuthenticated,)

    @requires_check_token_signature
    def post(self, request):
        self._model_class.objects.filter(username=request.user.username).update(token_signature="")
        return CustomResponse.success(self, "da dang xuat")
