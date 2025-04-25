from rest_framework import serializers
from .models import Requisition, RequisitionItem, RequisitionApproval
from vendors.serializers import VendorSerializer
from inventory.serializers import InventoryItemSerializer

class RequisitionItemSerializer(serializers.ModelSerializer):
    suggested_vendors_details = VendorSerializer(source='suggested_vendors', many=True, read_only=True)
    inventory_item_details = InventoryItemSerializer(source='inventory_item', read_only=True)
    
    class Meta:
        model = RequisitionItem
        fields = ('id', 'requisition', 'item_name', 'description', 'quantity',
                  'unit_of_measure', 'estimated_unit_price', 'estimated_cost',
                  'inventory_item', 'inventory_item_details', 'suggested_vendors',
                  'suggested_vendors_details')
        read_only_fields = ('requisition', 'estimated_cost')

class RequisitionApprovalSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source='approver.username', read_only=True)
    
    class Meta:
        model = RequisitionApproval
        fields = ('id', 'requisition', 'approver', 'approver_name', 'approved',
                  'approval_date', 'comments')
        read_only_fields = ('approval_date',)

class RequisitionSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.username', read_only=True)
    items = RequisitionItemSerializer(many=True, read_only=True)
    approvals = RequisitionApprovalSerializer(many=True, read_only=True)
    purchase_order_number = serializers.SerializerMethodField()
    
    class Meta:
        model = Requisition
        fields = ('id', 'title', 'department', 'requester', 'requester_name',
                  'status', 'date_created', 'date_needed', 'priority', 'justification',
                  'notes', 'total_estimated_cost', 'purchase_order', 'purchase_order_number',
                  'items', 'approvals')
        read_only_fields = ('requester', 'date_created', 'total_estimated_cost', 
                          'purchase_order', 'purchase_order_number')
    
    def get_purchase_order_number(self, obj):
        if obj.purchase_order:
            return obj.purchase_order.po_number
        return None

class RequisitionCreateSerializer(serializers.ModelSerializer):
    items = RequisitionItemSerializer(many=True)
    
    class Meta:
        model = Requisition
        fields = ('title', 'department', 'date_needed', 'priority', 'justification',
                  'notes', 'items')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Create the requisition
        requisition = Requisition.objects.create(**validated_data)
        
        # Create the items
        for item_data in items_data:
            # Handle many-to-many fields
            suggested_vendors = item_data.pop('suggested_vendors', [])
            
            # Create item
            requisition_item = RequisitionItem.objects.create(
                requisition=requisition,
                **item_data
            )
            
            # Add suggested vendors
            if suggested_vendors:
                requisition_item.suggested_vendors.set(suggested_vendors)
        
        # Calculate total cost
        requisition.calculate_total_cost()
        
        return requisition