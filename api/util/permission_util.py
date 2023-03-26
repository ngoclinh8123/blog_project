from rest_framework import permissions


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

        # allow user only read api
        if action in alias["view"]:
            return True

        # main_action = view.basename
        main_action = view.__class__.__module__.split(".")[1]

        for key, value in alias.items():
            if action in value:
                action = key

        permission = f"{action}_{main_action}"

        is_allow = True
        if request.user.user_permissions.filter(codename=permission).count():
            is_allow = True
        if request.user.groups.filter(permissions__codename=permission).count():
            is_allow = True
        return is_allow

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff is True:
            return True

        # check if user is author
        if request.user == obj.customer.user:
            return True
        return False
