from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from apps.post.models import Post
from apps.post.helper.sr import PostSr, ChangePostSr, AddPostSr
from apps.post.custom_pagination import CustomPageNumberPagination, has_pagination
from apps.post.helper.util import Util
from apps.post.custom_permisson import CustomPermission
from apps.auth.basic_auth.models import Customer
from apps.public.models import CustomResponse


class PostView(viewsets.GenericViewSet):

    _pagination_class = CustomPageNumberPagination
    permission_classes = [CustomPermission]
    queryset = Post.objects.all().order_by("id")

    def list(self, request):
        queryset = Post.objects.filter(status=1).order_by("id")
        posts = self._pagination_class().paginate_queryset(queryset, request, view=self)
        serializer = PostSr(posts, many=True)
        result = {
            "items": serializer.data,
            "pagination": has_pagination(request, self.queryset.count()),
        }
        message = gettext("Retrieved posts successfully.")
        return CustomResponse.success_response(self, message, result)

    def retrieve(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSr(post)
        message = gettext("Retrieved post successfully.")
        return CustomResponse.success_response(self, message, serializer.data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        data = request.data.copy()
        data.update(
            {
                "slug": Util.create_slug(self, 100, data["title"]),
                "customer": customer.id,
                "mod": 1,
            }
        )
        serializer = AddPostSr(data=data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Created post successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Failed to create post.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        data = request.data.copy()
        data["slug"] = Util.create_slug(self, 100, data["title"])
        serializer = ChangePostSr(post, data=data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated post successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Failed to update post.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        message = gettext("Deleted post successfully.")
        return CustomResponse.success_response(self, message)
