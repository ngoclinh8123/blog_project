from django.db import models

from module.post.models import Post

# Create your models here.


class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True, null=False)
    posts = models.ManyToManyField(Post, blank=True)

    def __str__(self):
        return f"{self.id} - {self.title}"

    class Meta:
        ordering = ["-id"]
        db_table = "tags"
