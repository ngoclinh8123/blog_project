from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.post.models import Post
from module.post.helper.sr import PostSr, ChangePostSr, AddPostSr
from module.post.helper.util import SlugUtil
from module.post.custom_permisson import CustomPermission
from module.auth.basic_auth.models import Customer
from module.post.custom_pagination import CustomPageNumberPagination
from public.utils.pagination_util import PaginationUtil
from public.utils.response_util import ResponseUtil


class PostView(viewsets.GenericViewSet):
    permission_classes = [CustomPermission]
    queryset = Post.objects.all().order_by("id")

    def list(self, request):
        # Get paginated posts
        posts = CustomPageNumberPagination().paginate_queryset(self.queryset, request, view=self)
        serializer = PostSr(posts, many=True)
        result = {
            "items": serializer.data,
            "pagination": PaginationUtil.has_pagination(
                self, request, self.queryset.count(), CustomPageNumberPagination.page_size
            ),
        }
        message = gettext("Retrieved posts successfully.")
        return ResponseUtil.success_response(self, message, result)

    def retrieve(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        serializer = PostSr(post)
        message = gettext("Retrieved post successfully.")
        return ResponseUtil.success_response(self, message, serializer.data)

    @action(detail=False, methods=["post"])
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        data = request.data.copy()
        data.update(
            {
                # create slug from title and length = 100
                "slug": SlugUtil().create_slug(100, data["title"]),
                "customer": customer.id,
                "mod": 1,
            }
        )
        serializer = AddPostSr(data=data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Created post successfully.")
            return ResponseUtil.success_response(self, message)
        message = gettext("Failed to create post.")
        return ResponseUtil.fail_response(self, message)

    @action(detail=True, methods=["put"])
    def change(self, request, pk):
        post = get_object_or_404(self.queryset, pk=pk)
        data = request.data.copy()
        data["slug"] = SlugUtil().create_slug(100, data["title"])
        serializer = ChangePostSr(post, data=data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated post successfully.")
            return ResponseUtil.success_response(self, message)
        message = gettext("Failed to update post.")
        return ResponseUtil.fail_response(self, message)

    @action(detail=True, methods=["delete"])
    def delete(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        post.delete()
        message = gettext("Deleted post successfully.")
        return ResponseUtil.success_response(self, message)
