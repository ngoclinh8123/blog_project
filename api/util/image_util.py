import os
import re
import base64
from datetime import datetime
from decouple import config


class ImageUtil:
    @staticmethod
    def handle_image_base64(html_str):
        pattern = r'<img[^>]*src\s*=\s*["\'](data:image/(\w+);base64,([\w+/=]+))["\'][^>]*>'
        img_dir='public/static/'
        def _base64_to_img(match):
            try:
                img_data = match.group(3)
                img_ext = match.group(2)
                img_file = datetime.now().strftime("%Y%m%d-%H%M%S.%f") + '.' + img_ext
                img_path = os.path.join(img_dir,"images", img_file)
                image=base64.b64decode(img_data)
                with open(img_path, 'wb') as f:
                    f.write(image)
                return '<img src="{}">'.format(os.path.join("/",img_dir,'images', img_file))
            except Exception as e:
                print("Error decoding base64 image: ", str(e))
                return match.group(0)

        return re.sub(pattern, _base64_to_img, html_str)
