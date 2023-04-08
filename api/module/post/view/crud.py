from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.auth.basic_auth.models import Customer
from module.post.models import Post
from module.post.helper.sr import PostSr, PostAllSr, ChangePostSr, AddPostSr
from module.post.helper.slug_util import SlugUtil
from module.post.custom_pagination import CustomPageNumberPagination
from util.permission_util import PermissionUtil
from util.pagination_util import PaginationUtil
from util.response_util import ResponseUtil
from util.image_util import ImageUtil


class PostView(viewsets.GenericViewSet):
    permission_classes = (PermissionUtil,)
    queryset = Post.objects.all().order_by("id").reverse()

    def list(self, request):
        # Get paginated posts
        posts = CustomPageNumberPagination().paginate_queryset(
            self.queryset, self.request, view=self
        )
        # posts = Post.objects.all().order_by("id")
        serializer = PostAllSr(posts, many=True)
        pagination = PaginationUtil.has_pagination(
            self.request,
            Post.objects.all().order_by("id").reverse().count(),
            CustomPageNumberPagination.page_size,
        )
        result = {"items": serializer.data, "pagination": pagination}
        message = gettext("Retrieved posts successfully.")
        return ResponseUtil.success_response(message, result)

    def retrieve(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        serializer = PostSr(post)
        message = gettext("Retrieved post successfully.")
        return ResponseUtil.success_response(message, serializer.data)

    @action(detail=False, methods=["post"])
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        # ImageUtil.handle_image_base64(request.data["content"])

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
            post = serializer.save()
            message = gettext("Created post successfully.")
            return ResponseUtil.success_response(message, post.id)
            # return ResponseUtil.success_response(message)
        message = gettext("Failed to create post.")
        return ResponseUtil.fail_response(message)

    @action(detail=True, methods=["put"])
    def change(self, request, pk):
        post = get_object_or_404(self.queryset, pk=pk)
        # check if user is author or staff
        self.check_object_permissions(request, post)

        data = request.data.copy()
        data["slug"] = SlugUtil().create_slug(100, data["title"])
        serializer = ChangePostSr(post, data=data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated post successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Failed to update post.")
        return ResponseUtil.fail_response(message)

    @action(detail=True, methods=["delete"])
    def delete(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)

        # check if user is author or staff
        self.check_object_permissions(request, post)

        post.delete()
        message = gettext("Deleted post successfully.")
        return ResponseUtil.success_response(message)
