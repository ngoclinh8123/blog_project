from django.contrib.auth import get_user_model
from rest_framework import serializers
from module.auth.basic_auth.models import Customer
from module.post.models import Post

User = get_user_model()


class CustomerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Customer
        fields = [
            "username",
        ]


class PostAllSr(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = Post
        fields= "__all__"


class PostSr(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = Post
        fields = "__all__"


class ChangePostSr(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("title", "content", "slug")


class AddPostSr(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("customer", "mod", "title", "content", "slug")
