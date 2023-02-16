from django.contrib import admin

from module.category.models import Category, Post_Category

# Register your models here.
admin.site.register(Category)
admin.site.register(Post_Category)
