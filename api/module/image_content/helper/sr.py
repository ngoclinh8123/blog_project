from rest_framework import serializers

from module.image_content.models import ImageContent


class ImageContentSr(serializers.ModelSerializer):
    class Meta:
        model = ImageContent
        exclude = ()
