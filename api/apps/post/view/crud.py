from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action

from ..models import Post
from ..helper.sr import PostSr, ChangePostSr, AddPostSr
from ..custom_pagination import CustomPageNumberPagination, has_pagination
from ..helper.util import create_slug
from ..custom_permisson import CustomPermission
from ...auth.basic_auth.models import Customer
from ...public.models import CustomResponse
from ...public.decorator import requires_check_token_signature


class PostView(viewsets.GenericViewSet):
    _model_class = Post
    _serializer_class = PostSr
    _pagination_class = CustomPageNumberPagination
    permission_classes = [
        CustomPermission,
    ]
    queryset = Post.objects.all().order_by("id")

    @requires_check_token_signature
    def list(self, request):
        data = Post.objects.filter(status=1).order_by("id")
        posts = self._pagination_class().paginate_queryset(data, request, view=self)
        serializer = self._serializer_class(posts, many=True)
        result = {
            "items": serializer.data,
            "pagination": has_pagination(request, self.queryset.count()),
        }
        return CustomResponse.data(self, result)

    @requires_check_token_signature
    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self._model_class, pk=pk)
        serializer = self._serializer_class(obj)
        return CustomResponse.data(self, serializer.data)

    @requires_check_token_signature
    @action(methods=["post"], detail=False)
    def add(self, request):
        slug = create_slug(100, request.data["title"])
        request.data["slug"] = slug
        customer = get_object_or_404(Customer, user=request.user.id)
        request.data["customer"] = customer.id
        request.data["mod"] = 1
        serializer = AddPostSr(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        else:
            return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["put"], detail=True)
    def change(self, request, pk=None):
        obj = get_object_or_404(self._model_class, pk=pk)
        slug = create_slug(100, request.data["title"])
        request.data["slug"] = slug
        serializer = ChangePostSr(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.success(self)
        return CustomResponse.fail(self)

    @requires_check_token_signature
    @action(methods=["delete"], detail=True)
    def delete(self, request, pk=None):
        obj = get_object_or_404(self._model_class, pk=pk)
        obj.delete()
        return CustomResponse.success(self)
