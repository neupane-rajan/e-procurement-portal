from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsSameUser(permissions.BasePermission):
    """
    Custom permission to only allow users to edit their own profile.
    """
    def has_object_permission(self, request, view, obj):
        # Allow read permissions to any request,
        # but write permissions only to the same user or admin
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.id == request.user.id or request.user.role == 'admin'

class IsProcurementOfficer(permissions.BasePermission):
    """
    Custom permission to only allow procurement officers and admins.
    """
    def has_permission(self, request, view):
        return request.user and (
            request.user.role == 'procurement_officer' or 
            request.user.role == 'admin'
        )

class IsVendor(permissions.BasePermission):
    """
    Custom permission to only allow vendors.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'vendor'