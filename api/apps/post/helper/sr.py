from rest_framework import serializers

from ..models import Post


class PostSr(serializers.ModelSerializer):
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
