from django.contrib import admin

from apps.tag.models import Tag, Tag_Post

# Register your models here.
admin.site.register(Tag)
admin.site.register(Tag_Post)
