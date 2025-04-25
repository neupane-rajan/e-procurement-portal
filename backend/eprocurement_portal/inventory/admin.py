from django.contrib import admin
from .models import Category, InventoryItem, InventoryTransaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'description')
    list_filter = ('parent',)
    search_fields = ('name', 'description')

class InventoryTransactionInline(admin.TabularInline):
    model = InventoryTransaction
    extra = 0
    readonly_fields = ('transaction_date', 'previous_quantity', 'new_quantity')
    fields = ('transaction_type', 'quantity', 'unit_price', 'reference', 'notes', 'created_by', 
              'transaction_date', 'previous_quantity', 'new_quantity')

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'current_quantity', 'minimum_quantity', 
                    'unit_price', 'needs_reorder', 'is_active')
    list_filter = ('category', 'is_active', 'unit_of_measure')
    search_fields = ('name', 'sku', 'description')
    readonly_fields = ('total_value',)
    inlines = [InventoryTransactionInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'sku', 'description', 'category')
        }),
        ('Stock Information', {
            'fields': ('current_quantity', 'minimum_quantity', 'unit_of_measure', 'unit_price', 'total_value')
        }),
        ('Location', {
            'fields': ('location',)
        }),
        ('Status', {
            'fields': ('is_active', 'last_ordered_date')
        }),
    )

@admin.register(InventoryTransaction)
class InventoryTransactionAdmin(admin.ModelAdmin):
    list_display = ('item', 'transaction_type', 'quantity', 'previous_quantity', 
                    'new_quantity', 'transaction_date', 'created_by')
    list_filter = ('transaction_type', 'transaction_date')
    search_fields = ('item__name', 'item__sku', 'reference', 'notes')
    readonly_fields = ('previous_quantity', 'new_quantity', 'transaction_date')