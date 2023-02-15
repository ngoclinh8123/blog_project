from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action

from ..models import Comment
from ..custom_permission import CustomPermission
from ..helper.sr import CommentSr, ChangeCommentSr, AddCommentSr
from ...auth.basic_auth.models import Customer
from ...public.models import CustomResponse
from ...public.util import nest_delete, nest_create
from ...public.decorator import requires_check_token_signature


class CommentView(viewsets.GenericViewSet):
    queryset = Comment.objects.all()
    permission_classes = (CustomPermission,)

    @requires_check_token_signature
    def retrieve(self, request, pk=None):
        comment = Comment.objects.filter(post=pk)
        serializer = CommentSr(comment, many=True)
        data = nest_create(serializer.data)
        return CustomResponse.data(self, data)

    @requires_check_token_signature
    @action(methods=["POST"], detail=False)
    def add(self, request):
        customer = get_object_or_404(Customer, user=request.user.id)
        request.data["customer"] = customer.id
        serializer = AddCommentSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["PUT"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(Comment, pk=pk)
        serializer = ChangeCommentSr(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        if nest_delete(Comment, pk):
            return CustomResponse.success(self)
        return CustomResponse.fail(self)
