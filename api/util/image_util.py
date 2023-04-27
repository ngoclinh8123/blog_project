import os
import re
import base64
import json
from datetime import datetime
from django.shortcuts import get_object_or_404
from module.image_content.models import ImageContent
from module.post.models import Post


class ImageUtil:
    @staticmethod
    def handle_update_image(data, post):
        if data.startswith("/"):
            data = data[1:]
        image = ImageContent.objects.get(image=data)
        image.post = post
        image.save()

    @staticmethod
    def handle_image_base64(html_str):
        pattern = (
            r'<img[^>]*src\s*=\s*["\'](data:image/(\w+);base64,([\w+/=]+))["\'][^>]*>'
        )
        img_dir = "public/static/"

        def _base64_to_img(match):
            try:
                img_data = match.group(3)
                img_ext = match.group(2)
                img_file = datetime.now().strftime("%Y%m%d-%H%M%S.%f") + "." + img_ext
                img_path = os.path.join(img_dir, "images", img_file)
                image = base64.b64decode(img_data)
                with open(img_path, "wb") as f:
                    f.write(image)
                return '<img src="{}">'.format(
                    os.path.join("/", img_dir, "images", img_file)
                )
            except Exception as e:
                print("Error decoding base64 image: ", str(e))
                return match.group(0)

        return re.sub(pattern, _base64_to_img, html_str)

    @staticmethod
    def handle_collect_image(content, postId):
        data = json.loads(content)
        blocks = data["blocks"]
        if len(blocks) > 0:
            post = Post.objects.get(id=postId)
            for block in blocks:
                if block["type"] == "image":
                    image = block["data"]["file"]["url"]
                    ImageUtil.handle_update_image(image, post)

    @staticmethod
    def handle_delete_image(path):
        if path.startswith("/"):
            path = path[1:]
        print(path)
        try:
            os.remove(path)
        except OSError as e:
            print(f"error: {e.filename} - {e.strerror}")

    @staticmethod
    def handle_delete_image_in_db(image_path):
        if image_path.startswith("/"):
            image_path = image_path[1:]
        image = ImageContent.objects.get(image=image_path)
        try:
            image.delete()
        except Exception:
            print("can't delete image ")

    @staticmethod
    def handle_delete_image_content(content):
        data = json.loads(content)
        blocks = data["blocks"]
        if len(blocks) > 0:
            for block in blocks:
                if block["type"] == "image":
                    image = block["data"]["file"]["url"]
                    ImageUtil.handle_delete_image_in_db(image)
                    ImageUtil.handle_delete_image(image)
