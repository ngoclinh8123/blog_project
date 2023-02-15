from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action

from ..models import Tag, Tag_Post
from ..helper.sr import TagSr, AddTagSr, AddTagPostSr, TagPostSr
from ..custom_permission import CustomPermission
from ...public.models import CustomResponse
from ...public.decorator import requires_check_token_signature


class TagView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Tag.objects.all()

    @requires_check_token_signature
    def list(self, request):
        tags = Tag.objects.all()
        serializer = TagSr(tags, many=True)
        return CustomResponse.data(self, serializer.data)

    @requires_check_token_signature
    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddTagSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Tag, pk=pk)
        serializer = AddTagSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Tag, pk=pk)
        obj.delete()
        return CustomResponse.success(self)


class TagPostView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Tag_Post.objects.all()

    @requires_check_token_signature
    def list(self, request):
        tags = Tag_Post.objects.all()
        serializer = TagPostSr(tags, many=True)
        return CustomResponse.data(self, serializer.data)

    @requires_check_token_signature
    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddTagPostSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Tag_Post, pk=pk)
        serializer = AddTagPostSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Tag_Post, pk=pk)
        obj.delete()
        return CustomResponse.success(self)
