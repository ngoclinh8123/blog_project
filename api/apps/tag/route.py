from rest_framework import routers
from .view.crud import TagView, TagPostView

routerTag = routers.SimpleRouter()
routerTag.register("api", TagView, basename="post")
routerTag.register("", TagPostView, basename="tag_post")
urlpatterns = routerTag.urls
