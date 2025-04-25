from django.contrib import admin
from .models import DashboardSettings, Notification, SavedReport

@admin.register(DashboardSettings)
class DashboardSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'show_requisitions', 'show_vendors', 'show_inventory', 'show_orders', 'default_date_range')
    search_fields = ('user__username',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'type', 'created_at', 'read')
    list_filter = ('type', 'read', 'created_at')
    search_fields = ('title', 'message', 'user__username')
    list_editable = ('read',)

@admin.register(SavedReport)
class SavedReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'report_type', 'created_at', 'last_run')
    list_filter = ('report_type', 'created_at')
    search_fields = ('name', 'user__username')