from rest_framework import routers
from module.tag.view.crud import TagView

routerTag = routers.SimpleRouter()
routerTag.register("api", TagView, basename="post")
urlpatterns = routerTag.urls
