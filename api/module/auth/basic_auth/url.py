from django.urls import path

from module.auth.basic_auth.view.custom import (
    Login,
    Logout,
    TokenRefresh,
    ChangePassword,
    ForgotPassword,
    ResetPassword,
)


urlpatterns = [
    path("token/", Login.as_view()),
    path("logout/", Logout.as_view()),
    path("token/refresh/", TokenRefresh.as_view()),
    path("password/change/", ChangePassword.as_view()),
    path("forgot_password/", ForgotPassword.as_view()),
    path("reset_password/", ResetPassword.as_view()),
]
