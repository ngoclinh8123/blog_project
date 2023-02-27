from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ChangePasswordSr(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    model = User
    new_password = serializers.CharField(required=True)
