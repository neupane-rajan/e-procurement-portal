from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .models import PurchaseOrder, PurchaseOrderItem, Shipment, ShipmentItem
from .serializers import (
    PurchaseOrderSerializer, PurchaseOrderCreateSerializer,
    PurchaseOrderItemSerializer, ShipmentSerializer, ShipmentItemSerializer
)
from inventory.models import InventoryTransaction
from requisitions.models import Requisition, RequisitionStatus
from users.permissions import IsProcurementOfficer, IsVendor

class PurchaseOrderListView(generics.ListAPIView):
    """API endpoint for listing purchase orders."""
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['po_number', 'vendor__company_name']
    ordering_fields = ['date_created', 'expected_delivery_date', 'status', 'grand_total']
    ordering = ['-date_created']
    
    def get_queryset(self):
        user = self.request.user
        queryset = PurchaseOrder.objects.all()
        
        # Vendors can only see their own POs
        if user.role == 'vendor':
            try:
                vendor = user.vendor_profile
                queryset = queryset.filter(vendor=vendor)
            except:
                return PurchaseOrder.objects.none()
        
        # Apply filters
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        vendor_id = self.request.query_params.get('vendor')
        if vendor_id:
            queryset = queryset.filter(vendor_id=vendor_id)
            
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(date_created__gte=start_date)
            
        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(date_created__lte=end_date)
            
        min_amount = self.request.query_params.get('min_amount')
        if min_amount:
            queryset = queryset.filter(grand_total__gte=min_amount)
            
        max_amount = self.request.query_params.get('max_amount')
        if max_amount:
            queryset = queryset.filter(grand_total__lte=max_amount)
            
        return queryset

class PurchaseOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, and deleting a purchase order."""
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Vendors can only see their own POs
        if user.role == 'vendor':
            try:
                vendor = user.vendor_profile
                return PurchaseOrder.objects.filter(vendor=vendor)
            except:
                return PurchaseOrder.objects.none()
        
        return PurchaseOrder.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()
    
    def update(self, request, *args, **kwargs):
        # Handle status updates specially
        po = self.get_object()
        
        if request.user.role == 'vendor':
            # Vendors can only update the status to 'acknowledged'
            new_status = request.data.get('status')
            if new_status and new_status == 'acknowledged':
                po.status = new_status
                po.save()
                return Response(self.get_serializer(po).data)
            else:
                return Response({'error': 'Vendors can only update status to acknowledged'},
                              status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Only allow deletion of draft POs
        po = self.get_object()
        if po.status != 'draft':
            return Response({'error': f'Cannot delete PO in {po.status} state.'},
                          status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

class PurchaseOrderCreateView(generics.CreateAPIView):
    """API endpoint for creating a purchase order."""
    serializer_class = PurchaseOrderCreateSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]
    
    def perform_create(self, serializer):
        # Create the PO
        po = serializer.save(created_by=self.request.user)
        
        # If this PO is created from a requisition, update the requisition status
        requisition_id = self.request.data.get('requisition_id')
        if requisition_id:
            try:
                requisition = Requisition.objects.get(id=requisition_id)
                # Link the requisition to the PO and update its status
                requisition.purchase_order = po
                requisition.status = RequisitionStatus.ORDERED
                requisition.save()
            except Requisition.DoesNotExist:
                pass

# Add the missing PurchaseOrderItemListView class
class PurchaseOrderItemListView(generics.ListAPIView):
    """API endpoint for listing purchase order items."""
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        purchase_order_id = self.kwargs.get('purchase_order_id')
        return PurchaseOrderItem.objects.filter(purchase_order_id=purchase_order_id)

class ShipmentListView(generics.ListCreateAPIView):
    """API endpoint for listing and creating shipments."""
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Vendors can only see shipments for their POs
        if user.role == 'vendor':
            try:
                vendor = user.vendor_profile
                return Shipment.objects.filter(purchase_order__vendor=vendor)
            except:
                return Shipment.objects.none()
        
        # Filter by purchase order if provided
        purchase_order_id = self.request.query_params.get('purchase_order_id')
        if purchase_order_id:
            return Shipment.objects.filter(purchase_order_id=purchase_order_id)
        
        return Shipment.objects.all()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()

class ShipmentDetailView(generics.RetrieveUpdateAPIView):
    """API endpoint for retrieving and updating a shipment."""
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Vendors can only see shipments for their POs
        if user.role == 'vendor':
            try:
                vendor = user.vendor_profile
                return Shipment.objects.filter(purchase_order__vendor=vendor)
            except:
                return Shipment.objects.none()
        
        return Shipment.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()

class ShipmentReceiveView(APIView):
    """API endpoint for receiving shipments."""
    permission_classes = [IsAuthenticated, IsProcurementOfficer]
    
    def post(self, request, pk):
        shipment = get_object_or_404(Shipment, pk=pk)
        received_items = request.data.get('items', [])
        
        if not received_items:
            return Response({
                'error': 'No items specified for receipt.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark current date as actual arrival
        if not shipment.actual_arrival_date:
            shipment.actual_arrival_date = timezone.now().date()
        
        # Mark the user who received the shipment
        shipment.received_by = request.user
        
        # Process each received item
        all_items_complete = True
        for item_data in received_items:
            shipment_item_id = item_data.get('shipment_item_id')
            quantity_received = item_data.get('quantity_received', 0)
            
            if not shipment_item_id or not quantity_received:
                continue
                
            try:
                shipment_item = ShipmentItem.objects.get(id=shipment_item_id, shipment=shipment)
                
                # Update received quantity
                previous_qty = shipment_item.quantity_received
                shipment_item.quantity_received = min(quantity_received, shipment_item.quantity_shipped)
                shipment_item.condition_notes = item_data.get('condition_notes', '')
                shipment_item.save()
                
                # Calculate quantity change
                qty_change = shipment_item.quantity_received - previous_qty
                
                if qty_change > 0:
                    # Update inventory
                    inventory_item = shipment_item.purchase_order_item.inventory_item
                    if inventory_item:
                        # Create transaction for inventory receipt
                        InventoryTransaction.objects.create(
                            item=inventory_item,
                            transaction_type='receipt',
                            quantity=qty_change,
                            unit_price=shipment_item.purchase_order_item.unit_price,
                            created_by=request.user,
                            reference=f"PO-{shipment.purchase_order.po_number}"
                        )
                
                # Check if any items are not fully received
                if shipment_item.quantity_received < shipment_item.quantity_shipped:
                    all_items_complete = False
                    
            except ShipmentItem.DoesNotExist:
                continue
        
        # If all items are fully received, mark shipment as complete
        if all_items_complete:
            shipment.is_complete = True
            
            # Check if all PO shipments are complete
            all_shipments_complete = all(
                s.is_complete for s in Shipment.objects.filter(purchase_order=shipment.purchase_order)
            )
            
            if all_shipments_complete:
                # If all shipments are complete, mark PO as complete
                shipment.purchase_order.status = 'complete'
                shipment.purchase_order.save()
                
                # If this PO was from a requisition, mark it as completed
                requisition = getattr(shipment.purchase_order, 'requisition', None)
                if requisition:
                    requisition.status = RequisitionStatus.COMPLETED
                    requisition.save()
            else:
                # If partial, mark PO as partially received
                shipment.purchase_order.status = 'partial'
                shipment.purchase_order.save()
        
        shipment.save()
        
        return Response({
            'message': 'Shipment received successfully.'
        }, status=status.HTTP_200_OK)