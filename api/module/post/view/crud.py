from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.post.models import Post
from module.post.helper.sr import PostSr, ChangePostSr, AddPostSr
from module.post.custom_pagination import CustomPageNumberPagination, CustomPagination
from module.post.helper.util import SlugUtil
from module.post.custom_permisson import CustomPermission
from module.auth.basic_auth.models import Customer
from module.public.models import CustomResponse


class PostView(viewsets.GenericViewSet):

    permission_classes = [CustomPermission]
    queryset = Post.objects.all().order_by("id")

    def list(self, request):
        # get all posts status = 1 from database
        posts = Post.objects.filter(status=1).order_by("id")

        # pagination posts
        posts_paginate = CustomPageNumberPagination().paginate_queryset(posts, request, view=self)

        serializer = PostSr(posts_paginate, many=True)
        result = {
            "items": serializer.data,
            "pagination": CustomPagination.has_pagination(self, request, posts.count()),
        }

        # return success response
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

        # add slug, customer and mod
        data.update(
            {
                # create slug from title and length = 100
                "slug": SlugUtil.create_slug(self, 100, data["title"]),
                "customer": customer.id,
                "mod": 1,
            }
        )

        serializer = AddPostSr(data=data)
        if serializer.is_valid():
            serializer.save()

            # return success response
            message = gettext("Created post successfully.")
            return CustomResponse.success_response(self, message)

        # else return error response
        message = gettext("Failed to create post.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)

        # create new slug and add slug to request
        data = request.data.copy()
        data["slug"] = SlugUtil.create_slug(self, 100, data["title"])

        serializer = ChangePostSr(post, data=data)
        if serializer.is_valid():
            serializer.save()

            # return success response
            message = gettext("Updated post successfully.")
            return CustomResponse.success_response(self, message)

        # else return error response
        message = gettext("Failed to update post.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        message = gettext("Deleted post successfully.")
        return CustomResponse.success_response(self, message)
