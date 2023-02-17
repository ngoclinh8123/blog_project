from django.db import models

from module.post.models import Post

# Create your models here.


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True, null=False)
    parent_id = models.IntegerField(default=0)
    posts = models.ManyToManyField(Post, blank=True)

    def __str__(self):
        return f"{self.id} - {self.title} - {self.parent_id}"

    class Meta:
        ordering = ["-id"]
        db_table = "categories"
