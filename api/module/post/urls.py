from django.urls import path
from module.post.view.crud import PostView

BASE_ENDPOINT = PostView.as_view({"get": "list", "post": "add"})

PK_ENDPOINT = PostView.as_view({"get": "retrieve", "put": "change", "delete": "delete"})

urlpatterns = [path("api/", BASE_ENDPOINT, name="posts"), path("api/<int:pk>", PK_ENDPOINT)]
