from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.db.models import F

class RequisitionStatus(models.TextChoices):
    DRAFT = 'draft', _('Draft')
    PENDING_APPROVAL = 'pending_approval', _('Pending Approval')
    APPROVED = 'approved', _('Approved')
    REJECTED = 'rejected', _('Rejected')
    ORDERED = 'ordered', _('Ordered')
    COMPLETED = 'completed', _('Completed')
    CANCELLED = 'cancelled', _('Cancelled')

class Requisition(models.Model):
    PRIORITY_CHOICES = [
        ('low', _('Low')),
        ('medium', _('Medium')),
        ('high', _('High')),
        ('urgent', _('Urgent')),
    ]
    
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requisitions'
    )
    status = models.CharField(
        max_length=20,
        choices=RequisitionStatus.choices,
        default=RequisitionStatus.DRAFT
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_needed = models.DateField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    justification = models.TextField()
    notes = models.TextField(blank=True)
    total_estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # If ordered, link to PO
    purchase_order = models.OneToOneField(
        'orders.PurchaseOrder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='requisition'
    )
    
    class Meta:
        verbose_name = _("Requisition")
        verbose_name_plural = _("Requisitions")
        ordering = ['-date_created']
    
    def __str__(self):
        return f"{self.title} - {self.department}"
    
    def calculate_total_cost(self):
        total = 0
        for item in self.items.all():
            total += item.estimated_cost
        self.total_estimated_cost = total
        self.save()

class RequisitionItem(models.Model):
    requisition = models.ForeignKey(
        Requisition,
        on_delete=models.CASCADE,
        related_name='items'
    )
    item_name = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.PositiveIntegerField()
    unit_of_measure = models.CharField(max_length=50)
    estimated_unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Optional link to inventory item if exists
    inventory_item = models.ForeignKey(
        'inventory.InventoryItem',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='requisition_items'
    )
    
    # Optional suggested vendors
    suggested_vendors = models.ManyToManyField('vendors.Vendor', blank=True, related_name='suggested_items')
    
    def __str__(self):
        return f"{self.item_name} ({self.quantity} {self.unit_of_measure})"
    
    def save(self, *args, **kwargs):
        self.estimated_cost = self.quantity * self.estimated_unit_price
        super().save(*args, **kwargs)
        # Update the requisition total
        if self.requisition:
            self.requisition.calculate_total_cost()

class RequisitionApproval(models.Model):
    requisition = models.ForeignKey(
        Requisition,
        on_delete=models.CASCADE,
        related_name='approvals'
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requisition_approvals'
    )
    approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(auto_now_add=True)
    comments = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['requisition', 'approver']
    
    def __str__(self):
        status = "Approved" if self.approved else "Rejected"
        return f"{self.requisition.title} - {self.approver.username} - {status}"