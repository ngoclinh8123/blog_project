from rest_framework import routers
from .view.crud import PostView

routerPost = routers.SimpleRouter()
routerPost.register("api", PostView, basename="post")
urlpatterns = routerPost.urls
