from rest_framework import serializers
from ..models import User


class ChangePasswordSr(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
