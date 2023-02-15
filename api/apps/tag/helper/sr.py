from rest_framework import serializers

from apps.tag.models import Tag, Tag_Post


class TagSr(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class AddTagSr(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("title",)


class TagPostSr(serializers.ModelSerializer):
    class Meta:
        model = Tag_Post
        fields = "__all__"


class AddTagPostSr(serializers.ModelSerializer):
    class Meta:
        model = Tag_Post
        fields = ("tag", "post")
