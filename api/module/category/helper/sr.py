from rest_framework import serializers

from module.category.models import Category


class CategorySr(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AddCategorySr(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("title", "parent_id", "posts")


class ChangeCategorySr(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("posts",)
