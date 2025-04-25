from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class DashboardSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='dashboard_settings'
    )
    show_requisitions = models.BooleanField(default=True)
    show_vendors = models.BooleanField(default=True)
    show_inventory = models.BooleanField(default=True)
    show_orders = models.BooleanField(default=True)
    default_date_range = models.PositiveIntegerField(default=30, help_text=_('Default date range in days'))
    
    class Meta:
        verbose_name = _("Dashboard Setting")
        verbose_name_plural = _("Dashboard Settings")
    
    def __str__(self):
        return f"{self.user.username}'s Dashboard Settings"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('requisition', _('Requisition Update')),
        ('approval', _('Approval Required')),
        ('inventory', _('Inventory Alert')),
        ('vendor', _('Vendor Update')),
        ('order', _('Purchase Order Update')),
        ('system', _('System Notification')),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"

class SavedReport(models.Model):
    REPORT_TYPES = [
        ('requisitions', _('Requisitions Report')),
        ('inventory', _('Inventory Report')),
        ('vendors', _('Vendors Report')),
        ('purchases', _('Purchases Report')),
        ('custom', _('Custom Report')),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='saved_reports'
    )
    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    parameters = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_run = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = _("Saved Report")
        verbose_name_plural = _("Saved Reports")
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.report_type}"