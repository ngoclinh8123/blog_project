from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action

from ..models import Category, Post_Category
from ..custom_permission import CustomPermission
from ..helper.sr import CategorySr, AddCategorySr, PostCategorySr
from ...public.util import nest_delete, nest_create
from ...public.models import CustomResponse
from ...public.decorator import requires_check_token_signature


class CategoryView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Category.objects.all()

    @requires_check_token_signature
    def list(self, request):
        data = Category.objects.all()
        serializer = CategorySr(data, many=True)
        data = nest_create(serializer.data)
        return CustomResponse.data(self, data)

    @requires_check_token_signature
    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddCategorySr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Category, pk=pk)
        serializer = CategorySr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if nest_delete(Category, pk):
            return CustomResponse.success(self)
        return CustomResponse.fail(self)


class PostCategoryView(viewsets.GenericViewSet):
    queryset = Post_Category.objects.all()

    @requires_check_token_signature
    def list(self, request):
        data = Post_Category.objects.all()
        serializer = PostCategorySr(data, many=True)
        return CustomResponse.data(self, serializer.data)

    @requires_check_token_signature
    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = PostCategorySr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Post_Category, pk=pk)
        serializer = PostCategorySr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Post_Category, pk=pk)
        obj.delete()
        return CustomResponse.success(self)
