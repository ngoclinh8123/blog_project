from django.urls import path
from module.category.view.crud import CategoryView

BASE_ENDPOINT = CategoryView.as_view({"get": "list", "post": "add"})

PK_ENDPOINT = CategoryView.as_view({"put": "change", "delete": "delete"})

urlpatterns = [path("", BASE_ENDPOINT), path("<int:pk>/", PK_ENDPOINT)]
