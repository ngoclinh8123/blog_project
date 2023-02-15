from rest_framework import serializers
from apps.comment.models import Comment


class CommentSr(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class AddCommentSr(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("post", "parent_id", "customer", "content")


class ChangeCommentSr(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("content",)
