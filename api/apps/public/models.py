from django.db import models
from rest_framework.response import Response
from rest_framework import status


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class CustomResponse:
    def success(self, message="success"):
        return Response(message, status=status.HTTP_200_OK)

    def fail(self, message="fail"):
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    def data(self, data):
        return Response(data, status=status.HTTP_200_OK)
