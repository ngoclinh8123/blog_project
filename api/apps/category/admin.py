from django.contrib import admin

from apps.category.models import Category, Post_Category

# Register your models here.
admin.site.register(Category)
admin.site.register(Post_Category)
