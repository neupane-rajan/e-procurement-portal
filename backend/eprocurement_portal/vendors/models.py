from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class VendorCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = _("Vendor Category")
        verbose_name_plural = _("Vendor Categories")
    
    def __str__(self):
        return self.name

class Vendor(models.Model):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    
    STATUS_CHOICES = [
        (PENDING, _('Pending')),
        (APPROVED, _('Approved')),
        (REJECTED, _('Rejected')),
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_profile'
    )
    company_name = models.CharField(max_length=255)
    company_registration_number = models.CharField(max_length=100)
    tax_identification_number = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    categories = models.ManyToManyField(VendorCategory, related_name='vendors')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    registration_date = models.DateTimeField(auto_now_add=True)
    approved_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_vendors'
    )
    
    class Meta:
        verbose_name = _("Vendor")
        verbose_name_plural = _("Vendors")
    
    def __str__(self):
        return self.company_name

class VendorDocument(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100)
    document = models.FileField(upload_to='vendor_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.document_type} - {self.vendor.company_name}"