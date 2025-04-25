from rest_framework import serializers
from .models import Category, InventoryItem, InventoryTransaction

class CategorySerializer(serializers.ModelSerializer):
    subcategory_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'parent', 'subcategory_count')
        
    def get_subcategory_count(self, obj):
        return obj.subcategories.count()

class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    needs_reorder = serializers.BooleanField(read_only=True)
    total_value = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    
    class Meta:
        model = InventoryItem
        fields = ('id', 'name', 'sku', 'description', 'category', 'category_name',
                'unit_of_measure', 'current_quantity', 'minimum_quantity',
                'unit_price', 'location', 'last_ordered_date', 'is_active',
                'created_at', 'updated_at', 'needs_reorder', 'total_value')
        read_only_fields = ('created_at', 'updated_at')

class InventoryTransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = InventoryTransaction
        fields = ('id', 'item', 'item_name', 'transaction_type', 'quantity',
                'previous_quantity', 'new_quantity', 'unit_price', 'transaction_date',
                'created_by', 'created_by_name', 'reference', 'notes')
        read_only_fields = ('transaction_date', 'previous_quantity', 'new_quantity',
                          'created_by', 'created_by_name')