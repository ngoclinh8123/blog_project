from django.urls import path
from module.comment.view.crud import CommentView

BASE_ENDPOINT = CommentView.as_view({"post": "add"})

PK_ENDPOINT = CommentView.as_view({"get": "list", "put": "change", "delete": "delete"})

urlpatterns = [path("api/", BASE_ENDPOINT), path("api/<int:pk>", PK_ENDPOINT)]
