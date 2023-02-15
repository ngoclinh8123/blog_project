from rest_framework import routers
from .view.crud import CommentView

routerComment = routers.SimpleRouter()
routerComment.register("api", CommentView, basename="comment")
urlpatterns = routerComment.urls
