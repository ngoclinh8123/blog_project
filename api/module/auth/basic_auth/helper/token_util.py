from rest_framework_simplejwt.tokens import RefreshToken


class TokenUtil:
    @staticmethod
    def get_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
        }

    @staticmethod
    def get_signature_from_token(token):
        return token.split(".")[-1]
