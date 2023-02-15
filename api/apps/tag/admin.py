from django.contrib import admin

from .models import Tag, Tag_Post

# Register your models here.
admin.site.register(Tag)
admin.site.register(Tag_Post)
