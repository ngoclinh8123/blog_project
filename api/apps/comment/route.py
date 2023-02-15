from rest_framework import routers
from apps.comment.view.crud import CommentView

routerComment = routers.SimpleRouter()
routerComment.register("api", CommentView, basename="comment")
urlpatterns = routerComment.urls
