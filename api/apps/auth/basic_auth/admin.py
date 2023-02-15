from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.auth.basic_auth.models import User, Customer, Staff

# Register your models here.
fields = list(UserAdmin.fieldsets)
fields[1] = ("User Info", {"fields": ("first_name", "last_name", "email", "token_signature")})
UserAdmin.fieldsets = tuple(fields)
admin.site.register(User, UserAdmin)

admin.site.register(Customer)
admin.site.register(Staff)
