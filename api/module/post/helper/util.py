import re
import random
from module.post.models import Post


class SlugUtil:
    def convert_text(self, text):
        search = [
            "àáạảãâầấậẩẫăằắặẳẵ",
            "èéẹẻẽêềếệểễ",
            "ìíịỉĩ",
            "òóọỏõôồốộổỗơờớợởỡ",
            "ùúụủũưừứựửữ",
            "ỳýỵỷỹ",
            "đ",
            "ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ",
            "ÈÉẸẺẼÊỀẾỆỂỄ",
            "ÌÍỊỈĨ",
            "ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ",
            "ÙÚỤỦŨƯỪỨỰỬỮ",
            "ỲÝỴỶỸ",
            "Đ",
        ]
        replace = [
            "a",
            "e",
            "i",
            "o",
            "u",
            "y",
            "d",
            "A",
            "E",
            "I",
            "O",
            "U",
            "Y",
            "D",
        ]
        for search_re, replace_re in zip(search, replace):
            text = re.sub(f"[{search_re}]", replace_re, text)
        return text.lower()

    def convert_separate(self, string):
        return "-".join(re.findall(r"\w+", string))

    def create_slug(self, length, title):
        new_title = self.convert_text(title[:length])
        slug = self.convert_separate(new_title)
        while Post.objects.filter(slug=slug).exists():
            slug = f"{slug}{random.randrange(0, 1000)}"
        return slug
