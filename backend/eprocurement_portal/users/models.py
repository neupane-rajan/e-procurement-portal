from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    ADMIN = 'admin'
    PROCUREMENT_OFFICER = 'procurement_officer'
    VENDOR = 'vendor'
    
    ROLE_CHOICES = [
        (ADMIN, _('Admin')),
        (PROCUREMENT_OFFICER, _('Procurement Officer')),
        (VENDOR, _('Vendor')),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=PROCUREMENT_OFFICER,
    )
    
    department = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
    
    def __str__(self):
        return self.username