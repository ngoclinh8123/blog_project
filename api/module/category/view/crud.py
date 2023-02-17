from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.category.models import Category
from module.category.custom_permission import CustomPermission
from module.category.helper.sr import CategorySr, AddCategorySr, ChangeCategorySr
from module.public.nest_util import NestUtil
from module.public.models import CustomResponse


class CategoryView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Category.objects.all()

    def list(self, request):
        categories = Category.objects.all()
        serializer = CategorySr(categories, many=True)
        data = NestUtil.nest_create(self, serializer.data)
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
    def change(self, request, pk):
        obj = get_object_or_404(Category, pk=pk)
        serializer = ChangeCategorySr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated category successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Updated category failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if NestUtil.nest_delete(self, Category, pk):
            message = gettext("Deleted category successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Deleted category failed.")
        return CustomResponse.fail_response(self, message)
