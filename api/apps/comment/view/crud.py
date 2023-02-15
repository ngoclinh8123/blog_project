from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from apps.comment.models import Comment
from apps.comment.custom_permission import CustomPermission
from apps.comment.helper.sr import CommentSr, ChangeCommentSr, AddCommentSr
from apps.auth.basic_auth.models import Customer
from apps.public.models import CustomResponse
from apps.public.util import Nest


class CommentView(viewsets.GenericViewSet):
    queryset = Comment.objects.all()
    permission_classes = (CustomPermission,)

    def retrieve(self, request, pk=None):
        comment = Comment.objects.filter(post=pk)
        serializer = CommentSr(comment, many=True)
        data = Nest.nest_create(self, serializer.data)
        message = gettext("Retrieved comment successfully.")
        return CustomResponse.success_response(self, message, data)

    @action(methods=["POST"], detail=False)
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        request.data["customer"] = customer.id
        serializer = AddCommentSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added comment successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Added comment failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["PUT"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Comment, pk=pk)
        serializer = ChangeCommentSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated comment successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Updated comment failed.")
        return CustomResponse.fail_response(self, message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if Nest.nest_delete(self, Comment, pk):
            message = gettext("Deleted comment successfully.")
            return CustomResponse.success_response(self, message)
        message = gettext("Deleted comment failed.")
        return CustomResponse.fail_response(self, message)
