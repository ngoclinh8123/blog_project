"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


from apps.post.route import routerPost
from apps.comment.route import routerComment
from apps.category.route import routerCategory
from apps.tag.route import routerTag

# from apps.auth import basic_auth


urlpatterns = [
    path("admin/", admin.site.urls),
    path("tags/", include(routerTag.urls)),
    path("posts/", include(routerPost.urls)),
    path("comments/", include(routerComment.urls)),
    path("categories/", include(routerCategory.urls)),
    path("auth/", include("apps.auth.basic_auth.url")),
]
