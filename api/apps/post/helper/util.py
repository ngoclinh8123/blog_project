import re
import random

from ..models import Post


def convert_text(text):
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


def convert_separate(string):
    return "-".join(re.findall(r"\w+", string))


def create_slug(length, title):
    title = convert_text(title[:length])
    slug = convert_separate(title)
    while Post.objects.filter(slug=slug).exists():
        slug = f"{slug}{random.randrange(0, 1000)}"
    return slug
