from util.image_util import ImageUtil
from module.image_content.models import ImageContent


def my_scheduled_job():
    datas = ImageContent.objects.filter(post=None)
    if len(datas) > 0:
        for x in datas:
            ImageUtil.handle_delete_image(str(x.image))
            x.delete()
