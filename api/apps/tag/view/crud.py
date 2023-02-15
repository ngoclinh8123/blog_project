from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from apps.tag.models import Tag, Tag_Post
from apps.tag.helper.sr import TagSr, AddTagSr, AddTagPostSr, TagPostSr
from apps.tag.custom_permission import CustomPermission
from apps.public.models import CustomResponse


class TagView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Tag.objects.all()

    def list(self, request):
        tags = Tag.objects.all()
        serializer = TagSr(tags, many=True)
        message = gettext("Retrieved tags successfully.")
        return CustomResponse.success_response(self, message, serializer.data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddTagSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added tag successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Added tag failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Tag, pk=pk)
        serializer = AddTagSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated tag successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Updated tag failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Tag, pk=pk)
        obj.delete()
        message = gettext("Deleted tag successfully.")
        return CustomResponse.success_response(self, message)


class TagPostView(viewsets.GenericViewSet):
    permission_classes = (CustomPermission,)
    queryset = Tag_Post.objects.all()

    def list(self, request):
        tags = Tag_Post.objects.all()
        serializer = TagPostSr(tags, many=True)
        message = gettext("Retrieved items successfully.")
        return CustomResponse.success_response(self, message, serializer.data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddTagPostSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added item successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Added item failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Tag_Post, pk=pk)
        serializer = AddTagPostSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated item successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Updated item failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Tag_Post, pk=pk)
        obj.delete()
        message = gettext("Deleted item successfully.")
        return CustomResponse.success_response(self, message)
