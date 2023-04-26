import os
import uuid
from datetime import datetime

from django.db import models
from module.post.models import Post


def img_dest(instance, filename):
    ext = filename.split(".")[-1]
    img_name = datetime.now().strftime("%Y%m%d-%H%M%S.%f")
    return os.path.join("public/static/images", f"{img_name}_{uuid.uuid4()}.{ext}")


class ImageContent(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to=img_dest)
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.id} - {self.post} - {self.image}"

    class Meta:
        db_table = "image_content"
