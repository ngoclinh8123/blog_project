from rest_framework.response import Response
from rest_framework import status


class ResponseUtil:
    def success_response(self, message="", data=None, status=200):
        response_data = {
            "success": True,
            "message": message,
            "data": data,
        }
        return Response(response_data, status=status)

    def fail_response(self, message="", data=None, status=400):
        response_data = {
            "success": False,
            "message": message,
            "data": data,
        }
        return Response(response_data, status=status)
