from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.category.models import Category, Post_Category
from module.category.custom_permission import CustomPermission
from module.category.helper.sr import CategorySr, AddCategorySr, PostCategorySr
from module.public.util import Nest
from module.public.models import CustomResponse


class CategoryView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Category.objects.all()

    def list(self, request):
        categories = Category.objects.all()
        serializer = CategorySr(categories, many=True)
        data = Nest.nest_create(self, serializer.data)
        message = gettext("Retrieved categories successfully.")
        return CustomResponse.success_response(self, message, data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddCategorySr(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # return success response
            message = gettext("Added category successfully.")
            return CustomResponse.success_response(self, message)

        # else return error response
        message = gettext("Added category failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Category, pk=pk)
        serializer = CategorySr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated category successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Updated category failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if Nest.nest_delete(self, Category, pk):
            message = gettext("Deleted category successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Deleted category failed.")
        return CustomResponse.fail_response(self, message)


class PostCategoryView(viewsets.GenericViewSet):
    queryset = Post_Category.objects.all()

    def list(self, request):
        data = Post_Category.objects.all()
        serializer = PostCategorySr(data, many=True)
        message = gettext("Retrieved items successfully.")
        return CustomResponse.success_response(self, message, serializer.data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = PostCategorySr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added item successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Added item failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Post_Category, pk=pk)
        serializer = PostCategorySr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated item successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Updated item failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Post_Category, pk=pk)
        obj.delete()
        message = gettext("Deleted item successfully.")
        return CustomResponse.success_response(self, message)
