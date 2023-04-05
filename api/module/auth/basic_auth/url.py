from django.urls import path

from module.auth.basic_auth.view.custom import (
    Login,
    Logout,
    TokenRefresh,
    ChangePassword,
    ForgotPassword,
    ResetPassword,
    UserView,
)


urlpatterns = [
    path("token/", Login.as_view()),
    path("logout/", Logout.as_view()),
    path("token/refresh/", TokenRefresh.as_view()),
    path("password/change/", ChangePassword.as_view()),
    path("forgot-password/", ForgotPassword.as_view()),
    path("reset-password/", ResetPassword.as_view()),
    path("user-info/", UserView.as_view()),
]
