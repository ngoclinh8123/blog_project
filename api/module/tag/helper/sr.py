from rest_framework import serializers

from module.tag.models import Tag


class TagSr(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class AddTagSr(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("title", "posts")


class ChangeTagSr(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("title", "posts")
