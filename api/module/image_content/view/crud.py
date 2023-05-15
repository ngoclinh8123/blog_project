from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from module.image_content.helper.sr import ImageContentSr


class ImageContentView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(methods=["post"], detail=False)
    def add(self, request):
        if "file" in self.request.data:
            self.request.data["image"] = self.request.data["file"]
        serializer = ImageContentSr(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        result = {"success": True, "file": {"url": serializer.data["image"]}}
        return Response(result)
