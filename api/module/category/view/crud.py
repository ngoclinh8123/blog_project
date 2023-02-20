from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.category.models import Category
from module.category.helper.sr import CategorySr, AddCategorySr, ChangeCategorySr
from util.nest_util import NestUtil
from util.response_util import ResponseUtil
from util.permission_util import PermissionUtil


class CategoryView(viewsets.GenericViewSet):
    permission_classes = (PermissionUtil,)
    queryset = Category.objects.all()

    def list(self, request):
        categories = Category.objects.all()
        serializer = CategorySr(categories, many=True)
        data = NestUtil.nest_create(self, serializer.data)
        message = gettext("Retrieved categories successfully.")
        return ResponseUtil.success_response(message, data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddCategorySr(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # return success response
            message = gettext("Added category successfully.")
            return ResponseUtil.success_response(message)

        # else return error response
        message = gettext("Added category failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk):
        obj = get_object_or_404(Category, pk=pk)
        serializer = ChangeCategorySr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated category successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Updated category failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if NestUtil.nest_delete(self, Category, pk):
            message = gettext("Deleted category successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Deleted category failed.")
        return ResponseUtil.fail_response(message)
