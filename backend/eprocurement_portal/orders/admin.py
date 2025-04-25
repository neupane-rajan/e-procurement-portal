from django.contrib import admin
from .models import PurchaseOrder, PurchaseOrderItem, Shipment, ShipmentItem

class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1

class ShipmentItemInline(admin.TabularInline):
    model = ShipmentItem
    extra = 1

class ShipmentInline(admin.TabularInline):
    model = Shipment
    extra = 0

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('po_number', 'vendor', 'date_created', 'expected_delivery_date', 'status', 'grand_total')
    list_filter = ('status', 'date_created')
    search_fields = ('po_number', 'vendor__company_name', 'notes')
    readonly_fields = ('total_amount', 'grand_total')
    inlines = [PurchaseOrderItemInline, ShipmentInline]
    
    fieldsets = (
        (None, {
            'fields': ('po_number', 'vendor', 'created_by', 'status')
        }),
        ('Dates', {
            'fields': ('date_created', 'expected_delivery_date')
        }),
        ('Addresses', {
            'fields': ('shipping_address', 'billing_address')
        }),
        ('Financial Details', {
            'fields': ('total_amount', 'tax_amount', 'shipping_cost', 'discount_amount', 'grand_total')
        }),
        ('Additional Information', {
            'fields': ('notes', 'terms_and_conditions')
        }),
    )

@admin.register(PurchaseOrderItem)
class PurchaseOrderItemAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'purchase_order', 'quantity', 'unit_of_measure', 'unit_price', 'total_price')
    list_filter = ('purchase_order__status',)
    search_fields = ('item_name', 'description', 'purchase_order__po_number')

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('purchase_order', 'tracking_number', 'carrier', 'expected_arrival_date', 
                    'actual_arrival_date', 'is_complete')
    list_filter = ('is_complete', 'expected_arrival_date', 'actual_arrival_date')
    search_fields = ('tracking_number', 'purchase_order__po_number', 'notes')
    inlines = [ShipmentItemInline]

@admin.register(ShipmentItem)
class ShipmentItemAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'purchase_order_item', 'quantity_shipped', 'quantity_received')
    list_filter = ('shipment__is_complete',)
    search_fields = ('shipment__tracking_number', 'purchase_order_item__item_name')