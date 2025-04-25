from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('sent', _('Sent to Vendor')),
        ('acknowledged', _('Acknowledged')),
        ('partial', _('Partially Received')),
        ('complete', _('Completed')),
        ('cancelled', _('Cancelled')),
    ]
    
    po_number = models.CharField(max_length=50, unique=True)
    vendor = models.ForeignKey(
        'vendors.Vendor',
        on_delete=models.CASCADE,
        related_name='purchase_orders'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_purchase_orders'
    )
    date_created = models.DateTimeField(auto_now_add=True)
    expected_delivery_date = models.DateField()
    shipping_address = models.TextField()
    billing_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True)
    terms_and_conditions = models.TextField(blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    class Meta:
        verbose_name = _("Purchase Order")
        verbose_name_plural = _("Purchase Orders")
        ordering = ['-date_created']
    
    def __str__(self):
        return f"PO-{self.po_number}"
    
    def calculate_totals(self):
        # Calculate the sum of all line items
        total = 0
        for item in self.items.all():
            total += item.total_price
        self.total_amount = total
        
        # Calculate grand total with tax, shipping, and discount
        self.grand_total = (
            self.total_amount + self.tax_amount + self.shipping_cost - self.discount_amount
        )
        self.save()

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name='items'
    )
    item_name = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.PositiveIntegerField()
    unit_of_measure = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Optional link to inventory item if exists
    inventory_item = models.ForeignKey(
        'inventory.InventoryItem',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_order_items'
    )
    
    # Optional link to requisition item if created from requisition
    requisition_item = models.ForeignKey(
        'requisitions.RequisitionItem',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_order_items'
    )
    
    def __str__(self):
        return f"{self.item_name} - {self.quantity} {self.unit_of_measure}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        # Update the PO total
        if self.purchase_order:
            self.purchase_order.calculate_totals()

class Shipment(models.Model):
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name='shipments'
    )
    tracking_number = models.CharField(max_length=100, blank=True)
    carrier = models.CharField(max_length=100, blank=True)
    expected_arrival_date = models.DateField(null=True, blank=True)
    actual_arrival_date = models.DateField(null=True, blank=True)
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_shipments'
    )
    notes = models.TextField(blank=True)
    is_complete = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Shipment for {self.purchase_order} - {self.tracking_number}"

class ShipmentItem(models.Model):
    shipment = models.ForeignKey(
        Shipment,
        on_delete=models.CASCADE,
        related_name='items'
    )
    purchase_order_item = models.ForeignKey(
        PurchaseOrderItem,
        on_delete=models.CASCADE,
        related_name='shipment_items'
    )
    quantity_shipped = models.PositiveIntegerField()
    quantity_received = models.PositiveIntegerField(default=0)
    condition_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.purchase_order_item.item_name} - {self.quantity_shipped} shipped, {self.quantity_received} received"