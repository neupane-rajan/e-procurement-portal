from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import F, Q
from .models import Category, InventoryItem, InventoryTransaction
from .serializers import (
    CategorySerializer, InventoryItemSerializer, InventoryTransactionSerializer
)
from users.permissions import IsProcurementOfficer

class CategoryListView(generics.ListCreateAPIView):
    """API endpoint for listing and creating inventory categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for managing a specific inventory category."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]

class InventoryItemListView(generics.ListCreateAPIView):
    """API endpoint for listing and creating inventory items."""
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'description']
    ordering_fields = ['name', 'current_quantity', 'unit_price', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = InventoryItem.objects.all()
        
        # Apply filters
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        min_quantity = self.request.query_params.get('min_quantity')
        if min_quantity:
            queryset = queryset.filter(current_quantity__gte=min_quantity)
            
        max_quantity = self.request.query_params.get('max_quantity')
        if max_quantity:
            queryset = queryset.filter(current_quantity__lte=max_quantity)
            
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            is_active = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active)
            
        needs_reorder = self.request.query_params.get('needs_reorder')
        if needs_reorder is not None:
            if needs_reorder.lower() == 'true':
                queryset = queryset.filter(current_quantity__lte=F('minimum_quantity'))
            
        return queryset

class InventoryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for managing a specific inventory item."""
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]

class InventoryTransactionView(generics.ListCreateAPIView):
    """API endpoint for listing and creating inventory transactions."""
    serializer_class = InventoryTransactionSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]
    
    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        return InventoryTransaction.objects.filter(item_id=item_id)
    
    def perform_create(self, serializer):
        item_id = self.kwargs.get('item_id')
        item = get_object_or_404(InventoryItem, id=item_id)
        serializer.save(item=item, created_by=self.request.user)

class LowStockItemsView(generics.ListAPIView):
    """API endpoint for listing items with low stock levels."""
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Find items where current quantity is at or below minimum quantity
        return InventoryItem.objects.filter(
            current_quantity__lte=F('minimum_quantity'),
            is_active=True
        )