from django.shortcuts import get_object_or_404
from django.utils.translation import gettext
from rest_framework import viewsets
from rest_framework.decorators import action
from module.comment.models import Comment
from module.comment.helper.sr import CommentSr, ChangeCommentSr, AddCommentSr
from module.auth.basic_auth.models import Customer
from util.tree_data_processor_util import TreeDataProcessor
from util.response_util import ResponseUtil
from util.permission_util import PermissionUtil


class CommentView(viewsets.GenericViewSet):
    queryset = Comment.objects.all()
    permission_classes = (PermissionUtil,)

    def list(self, request, pk=None):
        # get all comments of post id = pk
        comments = Comment.objects.filter(post=pk)
        serializer = CommentSr(comments, many=True)
        data = TreeDataProcessor.create_tree_data(serializer.data)
        message = gettext("Retrieved comment successfully.")
        return ResponseUtil.success_response(message, data)

    @action(methods=["POST"], detail=False)
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        request.data["customer"] = customer.id
        serializer = AddCommentSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Added comment successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Added comment failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["PUT"], detail=True)
    def change(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)

        # check if user is author or staff
        self.check_object_permissions(request, comment)

        serializer = ChangeCommentSr(comment, request.data)
        if serializer.is_valid():
            serializer.save()
            message = gettext("Updated comment successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Updated comment failed.")
        return ResponseUtil.fail_response(message)

    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)

        # check if user is author or staff
        self.check_object_permissions(request, comment)

        if TreeDataProcessor.delete_tree_data(Comment, pk):
            message = gettext("Deleted comment successfully.")
            return ResponseUtil.success_response(message)
        message = gettext("Deleted comment failed.")
        return ResponseUtil.fail_response(message)
