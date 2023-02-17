from django.shortcuts import get_object_or_404
from django.contrib.auth import login, get_user_model, authenticate
from django.utils.translation import gettext
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from module.auth.basic_auth.helper.sr import ChangePasswordSr
from module.auth.basic_auth.helper.token_util import TokenUtil
from module.public.models import CustomResponse

User = get_user_model()


class Login(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # Extract the request data
        data_request = request.data
        username = data_request["username"]
        password = data_request["password"]

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Login the user and generate a token
            login(request, user)
            token_access = TokenUtil.get_tokens_for_user(user)
            token_signature = TokenUtil.get_signature_from_token(token_access["access"])

            # Update the user's token signature in the database
            User.objects.filter(username=username).update(token_signature=token_signature)

            # Return a success response with the token
            message = gettext("Login successfully.")
            return CustomResponse.success_response(self, message, token_access["access"])

        # If the authentication fails, return an error response
        message = gettext("Account does not exist.")
        return CustomResponse.fail_response(self, message)


class TokenRefresh(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # get refresh token from request
        refresh_token = request.data

        # get old token signature
        old_token_signature = TokenUtil.get_signature_from_token(refresh_token["refresh"])

        # get user and new token signature for user
        user = get_object_or_404(User, token_signature=old_token_signature)
        token = TokenUtil.get_tokens_for_user(user)
        new_token_signature = TokenUtil.get_signature_from_token(token["access"])

        # update new token signature for user
        User.objects.filter(token_signature=old_token_signature).update(
            token_signature=new_token_signature
        )
        # return success response
        message = gettext("Refresh token successfully.")
        return CustomResponse.success_response(self, message, token)


class ChangePassword(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def update(self, request):
        serializer = ChangePasswordSr(data=request.data)
        user = request.user
        if serializer.is_valid():

            # if old password is wrong return response
            if not user.check_password(serializer.data.get("old_password")):
                message = gettext("Wrong password.")
                return CustomResponse.success_response(self, message)

            # else set new password for user
            user.set_password(serializer.data.get("new_password"))
            user.save()

            # if set new password success return success response
            message = gettext("Changed password successfully.")
            return CustomResponse.success_response(self, message)

        # else return error response
        message = gettext("Changed password failed.")
        return CustomResponse.fail_response(self, message)


class Logout(APIView):
    def post(self, request):
        # get authorization token from request header
        token = request.META.get("HTTP_AUTHORIZATION", " ").split(" ")[1]
        if token != "":
            # find user and delete token signature
            signature = token.split(".")[-1]
            User.objects.filter(token_signature=signature).update(token_signature="")
        message = gettext("Logout successfully.")

        # return success response
        return CustomResponse.success_response(self, message)
