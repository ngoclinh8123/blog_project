from django.shortcuts import get_object_or_404
from rest_framework import permissions

from module.comment.models import Comment


class CustomPermission(permissions.BasePermission):
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

        if action in alias["add"]:
            return True
        # check if user is author
        if action in alias["delete"] or action in alias["change"]:
            pk = view.kwargs["pk"]
            requestUser = request.user
            comment = get_object_or_404(Comment, id=pk)
            customer = comment.customer
            if customer.user.username == requestUser.username:
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