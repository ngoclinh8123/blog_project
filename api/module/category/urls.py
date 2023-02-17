from rest_framework import routers
from module.category.view.crud import CategoryView

routerCategory = routers.SimpleRouter()
routerCategory.register("api", CategoryView, basename="category")
urlpatterns = routerCategory.urls
