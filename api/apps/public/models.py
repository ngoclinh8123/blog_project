from django.db import models
from rest_framework.response import Response
from rest_framework import status


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class CustomResponse:
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
