from django.urls import path
from module.post.view.crud import PostView

BASE_ENDPOINT = PostView.as_view({"get": "list", "post": "add"})

PK_ENDPOINT = PostView.as_view({"put": "change", "delete": "delete"})

PK_ENDPOINT_VIEW = PostView.as_view(
    {
        "get": "retrieve",
    }
)

urlpatterns = [
    path("", BASE_ENDPOINT, name="posts"),
    path("<int:pk>/", PK_ENDPOINT),
    path("<str:slug>/", PK_ENDPOINT_VIEW),
]
