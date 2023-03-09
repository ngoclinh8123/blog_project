import os
from decouple import config
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import login, get_user_model, authenticate
from django.utils.translation import gettext
from django.http import JsonResponse
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from module.auth.basic_auth.helper.sr import ChangePasswordSr, ResetPasswordSr, UserInfoSr
from module.auth.basic_auth.helper.token_util import TokenUtil
from util.response_util import ResponseUtil


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

            # Create a response and set the token cookie as HTTP only
            response = JsonResponse({"message": "Login successfully."})
            response.set_cookie(key="token", value=token_access["access"], httponly=True)

            return response

        # If the authentication fails, return an error response
        message = gettext("Account does not exist.")
        return ResponseUtil.fail_response(message)


class TokenRefresh(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # get refresh token from request
        refresh_token = request.COOKIES["token"]

        # get old token signature
        old_token_signature = TokenUtil.get_signature_from_token(refresh_token)

        # get user and new token signature for user
        user = get_object_or_404(User, token_signature=old_token_signature)
        token = TokenUtil.get_tokens_for_user(user)
        new_token_signature = TokenUtil.get_signature_from_token(token["access"])

        # update new token signature for user
        User.objects.filter(token_signature=old_token_signature).update(
            token_signature=new_token_signature
        )
        # return success response
        response = JsonResponse({"message": "Refresh token successfully."})
        response.set_cookie(key="token", value=token["access"], httponly=True)
        return response


class ChangePassword(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def update(self, request):
        serializer = ChangePasswordSr(data=request.data)
        user = request.user
        if serializer.is_valid():

            # if old password is wrong return response
            if not user.check_password(serializer.data.get("old_password")):
                message = gettext("Wrong password.")
                return ResponseUtil.success_response(message)

            # else set new password for user
            user.set_password(serializer.data.get("new_password"))
            user.save()

            # if set new password success return success response
            message = gettext("Changed password successfully.")
            return ResponseUtil.success_response(message)

        # else return error response
        message = gettext("Changed password failed.")
        return ResponseUtil.fail_response(message)


class Logout(APIView):
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request):
        # get authorization token from request header
        token = request.COOKIES.get("token", "")
        if token != "":
            # find user and delete token signature
            signature = token.split(".")[-1]
            User.objects.filter(token_signature=signature).update(token_signature="")
        message = gettext("Logout successfully.")
        response = JsonResponse({"message": message})
        response.delete_cookie("token")
        return response


class ForgotPassword(APIView):
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request):
        try:
            email = request.data["email"]
        except:
            message = gettext("Please enter your email address .")
            return ResponseUtil.fail_response(message)

        # get user from email
        user = get_object_or_404(User, email=email)

        # create token for user
        token = TokenUtil.get_tokens_for_user(user)
        new_token_signature = TokenUtil.get_signature_from_token(token["access"])

        # update new token signature for user
        User.objects.filter(email=email).update(token_signature=new_token_signature)

        # create link to reset password form
        scheme = request.scheme
        # domain run port in frontend
        domain = config("DOMAIN_FRONTEND")
        # path to reset password form in frontend
        path = "reset-password"
        link = f"{scheme}://{domain}/{path}?token={token['access']}"

        subject = "Password Reset Request for Your Account"
        message = f"To reset your password, please click on the following link: {link}"
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [
            email,
        ]
        try:
            send_mail(subject, message, email_from, recipient_list, fail_silently=False)
            message = gettext("Email sent successfully .")
            return ResponseUtil.success_response(message)
        except:
            message = gettext("Email sent failed .")
            return ResponseUtil.fail_response(message)


class ResetPassword(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        serializer = ResetPasswordSr(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.data.get("new_password"))
            user.save()
            message = gettext("Reset password successfully.")
            return ResponseUtil.success_response(message)
        else:
            message = gettext("Reset password failed.")
            return ResponseUtil.fail_response(message)


class UserView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):
        # get authorization token from request header
        token = request.META.get("HTTP_AUTHORIZATION", " ").split(" ")[1]
        if token != "":
            # find user and delete token signature
            signature = token.split(".")[-1]
            user = get_object_or_404(User, token_signature=signature)
            serializer = UserInfoSr(user)
            message = gettext("Get user successfully.")
            return ResponseUtil.success_response(message, serializer.data)
        message = gettext("Get user failed.")
        return ResponseUtil.fail_response(message)
