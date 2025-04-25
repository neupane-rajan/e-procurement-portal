from rest_framework import serializers
from .models import DashboardSettings, Notification, SavedReport

class DashboardSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardSettings
        fields = ('id', 'show_requisitions', 'show_vendors', 'show_inventory',
                'show_orders', 'default_date_range')
        read_only_fields = ('id',)

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'user', 'type', 'title', 'message', 'link',
                'created_at', 'read')
        read_only_fields = ('id', 'user', 'created_at')

class SavedReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedReport
        fields = ('id', 'user', 'name', 'report_type', 'parameters',
                'created_at', 'last_run')
        read_only_fields = ('id', 'user', 'created_at')