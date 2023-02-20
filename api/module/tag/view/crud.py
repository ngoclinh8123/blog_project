from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.tag.models import Tag
from module.tag.helper.sr import TagSr, AddTagSr, ChangeTagSr
from util.response_util import ResponseUtil
from util.permission_util import PermissionUtil


class TagView(viewsets.GenericViewSet):
    permission_classes = (PermissionUtil,)
    queryset = Tag.objects.all()

    def list(self, request):
        tags = Tag.objects.all()
        serializer = TagSr(tags, many=True)
        message = gettext("Retrieved tags successfully.")
        return ResponseUtil.success_response(message, serializer.data)

    @action(methods=["post"], detail=False)
    def add(self, request):
        serializer = AddTagSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added tag successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Added tag failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["put"], detail=True)
    def change(self, request, pk):
        obj = get_object_or_404(Tag, pk=pk)
        serializer = ChangeTagSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated tag successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Updated tag failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(Tag, pk=pk)
        obj.delete()
        message = gettext("Deleted tag successfully.")
        return ResponseUtil.success_response(message)
