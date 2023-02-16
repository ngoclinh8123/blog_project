from rest_framework import serializers

from module.category.models import Category, Post_Category


class CategorySr(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AddCategorySr(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("title", "parent_id")


class PostCategorySr(serializers.ModelSerializer):
    class Meta:
        model = Post_Category
        fields = "__all__"
