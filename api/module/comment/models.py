from django.db import models

from util.model_util import ModelUtil
from module.auth.basic_auth.models import Customer
from module.post.models import Post

# Create your models here.
class Comment(ModelUtil):
    id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    parent_id = models.IntegerField(default=0)
    content = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return f"{self.id} - {self.content} - {self.parent_id}"

    class Meta:
        ordering = ["-id"]
        db_table = "comments"
