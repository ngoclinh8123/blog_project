from django.urls import path, include

urlpatterns = [
    path("tag/", include("module.tag.urls")),
    path("post/", include("module.post.urls")),
    path("comment/", include("module.comment.urls")),
    path("category/", include("module.category.urls")),
    path("auth/", include("module.auth.basic_auth.url")),
]
