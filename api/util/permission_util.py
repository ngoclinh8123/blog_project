from django.shortcuts import get_object_or_404
from rest_framework import permissions

from module.post.models import Post


class PermissionUtil(permissions.BasePermission):
    def has_permission(self, request, view):
        action = request.method
        if request.user.is_staff is True:
            return True

        alias = {
            "view": ["GET"],
            "delete": ["DELETE"],
            "add": ["POST"],
            "change": ["PUT", "PATCH"],
        }

        # cho quyen xem
        if action in alias["view"]:
            return True

        main_action = view.basename
        for key, value in alias.items():
            if action in value:
                action = key

        permission = f"{action}_{main_action}"

        is_allow = False
        if request.user.user_permissions.filter(codename=permission).count():
            is_allow = True
        if request.user.groups.filter(permissions__codename=permission).count():
            is_allow = True
        return is_allow
