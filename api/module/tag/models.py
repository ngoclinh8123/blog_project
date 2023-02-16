from django.db import models

from module.post.models import Post

# Create your models here.


class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True, null=False)

    def __str__(self):
        return f"{self.id} - {self.title}"

    class Meta:
        ordering = ["-id"]
        db_table = "tags"


class Tag_Post(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def _str_(self):
        return f"{self.tag.title} - {self.post.title}"

    class Meta:
        ordering = ["-id"]
        db_table = "tags_posts"
