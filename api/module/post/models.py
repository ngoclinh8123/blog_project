from django.db import models

from util.model_util import ModelUtil
from module.auth.basic_auth.models import Customer, Staff

# Create your models here.


class Post(ModelUtil):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    mod = models.ForeignKey(Staff, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null=False, blank=False)
    content = models.TextField(null=True, blank=True)
    slug = models.CharField(max_length=255, unique=True, null=False, blank=False)
    status = models.IntegerField(null=True, blank=True, default=1)
    blocked_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.title}"

    class Meta:
        ordering = ["-id"]
        db_table = "posts"
