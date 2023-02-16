from django.db import models

from apps.post.models import Post

# Create your models here.


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True, null=False)
    parent_id = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id} - {self.title} - {self.parent_id}"

    class Meta:
        ordering = ["-id"]
        db_table = "categories"


class Post_Category(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.category.title} - {self.post.title}"

    class Meta:
        ordering = ["-id"]
        db_table = "posts_categories"
