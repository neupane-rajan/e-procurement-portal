from django.utils import timezone
import random
from rest_framework import serializers
from .models import PurchaseOrder, PurchaseOrderItem, Shipment, ShipmentItem

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ('id', 'purchase_order', 'item_name', 'description', 'quantity', 
                  'unit_of_measure', 'unit_price', 'total_price', 'inventory_item', 
                  'requisition_item')
        read_only_fields = ('total_price',)

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = ('id', 'po_number', 'vendor', 'vendor_name', 'created_by', 
                  'created_by_name', 'date_created', 'expected_delivery_date', 
                  'shipping_address', 'billing_address', 'status', 'notes', 
                  'terms_and_conditions', 'total_amount', 'tax_amount', 
                  'shipping_cost', 'discount_amount', 'grand_total', 'items')
        read_only_fields = ('po_number', 'date_created', 'created_by', 'created_by_name', 
                           'total_amount', 'grand_total')

class PurchaseOrderCreateSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)
    
    class Meta:
        model = PurchaseOrder
        fields = ('vendor', 'expected_delivery_date', 'shipping_address', 
                  'billing_address', 'notes', 'terms_and_conditions', 
                  'tax_amount', 'shipping_cost', 'discount_amount', 'items')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate PO number (you can customize this)
        po_number = f"PO-{timezone.now().strftime('%Y%m')}-{random.randint(1000, 9999)}"
        
        # Create the PO
        purchase_order = PurchaseOrder.objects.create(
            po_number=po_number,
            **validated_data
        )
        
        # Create the PO items
        for item_data in items_data:
            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                **item_data
            )
        
        # Calculate totals
        purchase_order.calculate_totals()
        
        return purchase_order

class ShipmentItemSerializer(serializers.ModelSerializer):
    purchase_order_item_details = PurchaseOrderItemSerializer(source='purchase_order_item', read_only=True)
    item_name = serializers.CharField(source='purchase_order_item.item_name', read_only=True)
    
    class Meta:
        model = ShipmentItem
        fields = ('id', 'shipment', 'purchase_order_item', 'purchase_order_item_details', 
                  'item_name', 'quantity_shipped', 'quantity_received', 'condition_notes')
        read_only_fields = ('shipment',)

class ShipmentSerializer(serializers.ModelSerializer):
    items = ShipmentItemSerializer(many=True, read_only=True)
    purchase_order_number = serializers.CharField(source='purchase_order.po_number', read_only=True)
    vendor_name = serializers.CharField(source='purchase_order.vendor.company_name', read_only=True)
    received_by_name = serializers.CharField(source='received_by.username', read_only=True)
    
    class Meta:
        model = Shipment
        fields = ('id', 'purchase_order', 'purchase_order_number', 'vendor_name', 
                  'tracking_number', 'carrier', 'expected_arrival_date', 
                  'actual_arrival_date', 'received_by', 'received_by_name', 
                  'notes', 'is_complete', 'items')
        read_only_fields = ('received_by', 'received_by_name', 'actual_arrival_date', 'is_complete')