from django.urls import path

from .view.custom import Login, Logout, TokenRefresh, ChangePassword

urlpatterns = [
    path("token/", Login.as_view()),
    path("logout/", Logout.as_view()),
    path("token/refresh/", TokenRefresh.as_view()),
    path("password/change/", ChangePassword.as_view()),
]
