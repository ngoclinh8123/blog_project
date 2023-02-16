import ast
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


class RequestUtil:
    @staticmethod
    def get_request_data(request):
        requestData = request.body.decode("utf-8")
        data = ast.literal_eval(requestData)
        return data
