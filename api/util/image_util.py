import base64
import re
import os
from datetime import datetime


class ImageUtil:
    @staticmethod
    def handle_image_base64(str):
        pattern = (
            r'<img[^>]*src\s*=\s*["\'](data:image/(\w+);base64,([\w+/=]+))["\'][^>]*>'
        )
        print(re.sub(pattern, "?---?", str))
