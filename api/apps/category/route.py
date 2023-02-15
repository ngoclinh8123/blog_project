from rest_framework import routers
from .view.crud import CategoryView, PostCategoryView

routerCategory = routers.SimpleRouter()
routerCategory.register("api", CategoryView, basename="category")
routerCategory.register("", PostCategoryView, basename="")
urlpatterns = routerCategory.urls
