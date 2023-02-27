from decouple import config
from django.contrib.auth import get_user_model


class TestUserAccountUtil:
    @staticmethod
    def create_user():
        User = get_user_model()
        return User.objects.create(
            username=config("TEST_USER_USERNAME"),
            password=config("TEST_USER_PASSWORD"),
            email=config("TEST_USER_EMAIL"),
        )

    @staticmethod
    def create_super_user():
        User = get_user_model()
        return User.objects.create(
            username=config("TEST_SUPERUSER_USERNAME"),
            password=config("TEST_SUPERUSER_PASSWORD"),
            email=config("TEST_SUPERUSER_EMAIL"),
            is_staff=True,
            is_superuser=True,
        )
