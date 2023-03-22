from django.urls import path
from module.category.view.crud import CategoryView

BASE_ENDPOINT = CategoryView.as_view({"get": "list", "post": "add"})

PK_ENDPOINT = CategoryView.as_view({"get": "retrieve", "put": "change", "delete": "delete"})

urlpatterns = [
    path("api/", BASE_ENDPOINT, name="category_list"),
    path("api/<int:pk>/", PK_ENDPOINT, name="category_detail"),
]
