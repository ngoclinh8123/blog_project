from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.comment.models import Comment
from module.comment.helper.sr import CommentSr, ChangeCommentSr, AddCommentSr
from module.auth.basic_auth.models import Customer
from public.utils.nest_util import NestUtil
from public.utils.response_util import ResponseUtil
from public.utils.permission_util import PermissionUtil


class CommentView(viewsets.GenericViewSet):
    queryset = Comment.objects.all()
    permission_classes = (PermissionUtil,)

    def retrieve(self, request, pk=None):
        # get all comments of post
        comments = Comment.objects.filter(post=pk)
        serializer = CommentSr(comments, many=True)
        data = NestUtil.nest_create(self, serializer.data)
        message = gettext("Retrieved comment successfully.")
        return ResponseUtil.success_response(self, message, data)

    @action(methods=["POST"], detail=False)
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        request.data["customer"] = customer.id
        serializer = AddCommentSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added comment successfully.")
            return ResponseUtil.success_response(self, message)
        message = gettext("Added comment failed.")
        return ResponseUtil.fail_response(self, message)

    @action(methods=["PUT"], detail=True)
    def change(self, request, pk):
        obj = get_object_or_404(Comment, pk=pk)
        serializer = ChangeCommentSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated comment successfully.")
            return ResponseUtil.success_response(self, message)
        message = gettext("Updated comment failed.")
        return ResponseUtil.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if NestUtil.nest_delete(self, Comment, pk):
            message = gettext("Deleted comment successfully.")
            return ResponseUtil.success_response(self, message)
        message = gettext("Deleted comment failed.")
        return ResponseUtil.fail_response(self, message)
