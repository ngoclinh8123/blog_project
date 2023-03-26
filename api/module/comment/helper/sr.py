from django.contrib.auth import get_user_model
from rest_framework import serializers
from module.auth.basic_auth.models import Customer
from module.comment.models import Comment

User = get_user_model()


class CustomerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Customer
        fields = [
            "username",
        ]


class CommentSr(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = Comment
        fields = ["id", "post", "customer", "parent_id", "content"]


class AddCommentSr(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("post", "parent_id", "customer", "content")


class ChangeCommentSr(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("content",)
