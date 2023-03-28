from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.category.models import Category
from module.post.models import Post
from module.post.helper.sr import PostSr
from module.post.custom_pagination import CustomPageNumberPagination
from util.pagination_util import PaginationUtil
from module.category.helper.sr import CategorySr, AddCategorySr, ChangeCategorySr
from util.tree_data_processor_util import TreeDataProcessor
from util.response_util import ResponseUtil
from util.permission_util import PermissionUtil


class CategoryView(viewsets.GenericViewSet):
    permission_classes = (PermissionUtil,)
    queryset = Category.objects.all()

    def list(self, request):
        categories = Category.objects.all()
        serializer = CategorySr(categories, many=True)
        data = TreeDataProcessor.create_tree_data(serializer.data)
        message = gettext("Retrieved categories successfully.")
        return ResponseUtil.success_response(message, data)

    def retrieve(self, request, pk):
        if type(pk) == int and pk >= 0:
            # Get paginated posts
            posts = CustomPageNumberPagination().paginate_queryset(
                Post.objects.filter(category__id=pk), request, view=self
            )
            serializer = PostSr(posts, many=True)
            result = {
                "items": serializer.data,
                "pagination": PaginationUtil.has_pagination(
                    request, self.queryset.count(), CustomPageNumberPagination.page_size
                ),
            }
            message = gettext("Retrieved posts successfully.")
            return ResponseUtil.success_response(message, result)

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
            category = serializer.save()

            # return posts of category after change
            posts = Post.objects.filter(category__id=pk)
            postsr = PostSr(posts, many=True)

            message = gettext("Updated category successfully.")
            return ResponseUtil.success_response(message, postsr.data)
        message = gettext("Updated category failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if TreeDataProcessor.delete_tree_data(Category, pk):
            message = gettext("Deleted category successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Deleted category failed.")
        return ResponseUtil.fail_response(message)
