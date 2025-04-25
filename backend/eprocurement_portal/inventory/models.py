from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.core.validators import MinValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories'
    )
    
    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['name']
    
    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='items'
    )
    unit_of_measure = models.CharField(max_length=50)
    current_quantity = models.PositiveIntegerField(default=0)
    minimum_quantity = models.PositiveIntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255, blank=True)
    last_ordered_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Inventory Item")
        verbose_name_plural = _("Inventory Items")
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.sku})"
    
    @property
    def needs_reorder(self):
        return self.current_quantity <= self.minimum_quantity
    
    @property
    def total_value(self):
        return self.current_quantity * self.unit_price
    
class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('receipt', _('Receipt')),
        ('issue', _('Issue')),
        ('adjustment', _('Adjustment')),
        ('return', _('Return')),
    ]
    
    item = models.ForeignKey(
        InventoryItem,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    previous_quantity = models.PositiveIntegerField()
    new_quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='inventory_transactions'
    )
    reference = models.CharField(max_length=100, blank=True, help_text=_("PO number or other reference"))
    notes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = _("Inventory Transaction")
        verbose_name_plural = _("Inventory Transactions")
        ordering = ['-transaction_date']
    
    def __str__(self):
        return f"{self.transaction_type} - {self.item.name} - {self.quantity} units"
    
    def save(self, *args, **kwargs):
        # Update the item's current quantity
        previous_quantity = self.item.current_quantity
        self.previous_quantity = previous_quantity
        
        if self.transaction_type == 'receipt' or self.transaction_type == 'return':
            self.item.current_quantity += self.quantity
        elif self.transaction_type == 'issue':
            self.item.current_quantity = max(0, self.item.current_quantity - self.quantity)
        elif self.transaction_type == 'adjustment':
            # For adjustments, quantity represents the new total quantity
            self.item.current_quantity = self.quantity
        
        self.new_quantity = self.item.current_quantity
        self.item.save()
        
        super().save(*args, **kwargs)