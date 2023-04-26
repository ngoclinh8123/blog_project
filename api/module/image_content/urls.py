from django.urls import path
from module.image_content.view.crud import ImageContentView

BASE_ENDPOINT = ImageContentView.as_view({"post": "add"})

PK_ENDPOINT = ImageContentView.as_view(
    {"get": "list", "put": "change", "delete": "delete"}
)

urlpatterns = [path("", BASE_ENDPOINT), path("<int:pk>/", PK_ENDPOINT)]
