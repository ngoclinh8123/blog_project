import random
from django_cron import CronJobBase, Schedule
from module.tag.models import Tag


class MyCronJob(CronJobBase):
    RUN_EVERY_MINS = 1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = "image_content.cron"  # a unique code

    def do(self):
        tag = Tag(title=str(random(10, 100)))
        tag.save()
