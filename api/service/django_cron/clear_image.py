from django_cron import CronJobBase, Schedule
from util.image_util import ImageUtil
from module.image_content.models import ImageContent


class ClearImage(CronJobBase):
    RUN_EVERY_MINS = 1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = "image_content.cron"  # a unique code

    def do(self):
        datas = ImageContent.objects.filter(post=None)
        if len(datas) > 0:
            for x in datas:
                ImageUtil.handle_delete_image(str(x.image))
                x.delete()
