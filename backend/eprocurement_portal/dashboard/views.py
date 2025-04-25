from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum, Avg, Q, F, Case, When, BooleanField
from django.utils import timezone
from datetime import timedelta
from .models import DashboardSettings, Notification, SavedReport
from .serializers import (
    DashboardSettingsSerializer, NotificationSerializer, SavedReportSerializer
)
from requisitions.models import Requisition
from inventory.models import InventoryItem, InventoryTransaction
from vendors.models import Vendor
from orders.models import PurchaseOrder

class DashboardSummaryView(APIView):
    """API endpoint for retrieving a summary of the dashboard data."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get dashboard settings or create default
        settings, _ = DashboardSettings.objects.get_or_create(
            user=request.user,
            defaults={
                'show_requisitions': True,
                'show_vendors': True,
                'show_inventory': True,
                'show_orders': True,
                'default_date_range': 30
            }
        )
        
        # Default date range is 30 days if not specified
        days = request.query_params.get('days', settings.default_date_range)
        try:
            days = int(days)
        except ValueError:
            days = 30
            
        start_date = timezone.now() - timedelta(days=days)
        
        data = {}
        
        # Requisition summary
        if settings.show_requisitions:
            requisition_data = {}
            
            # Count by status
            status_counts = Requisition.objects.filter(
                date_created__gte=start_date
            ).values('status').annotate(count=Count('id'))
            
            requisition_data['status_counts'] = {item['status']: item['count'] for item in status_counts}
            
            # Recent requisitions
            recent_requisitions = Requisition.objects.filter(
                date_created__gte=start_date
            ).order_by('-date_created')[:5].values(
                'id', 'title', 'requester__username', 'status', 'date_created', 'priority', 'total_estimated_cost'
            )
            
            requisition_data['recent'] = list(recent_requisitions)
            
            data['requisitions'] = requisition_data
            
        # Vendor summary
        if settings.show_vendors:
            vendor_data = {}
            
            # Count by status
            status_counts = Vendor.objects.values('status').annotate(count=Count('id'))
            vendor_data['status_counts'] = {item['status']: item['count'] for item in status_counts}
            
            # Recent vendors
            recent_vendors = Vendor.objects.order_by('-registration_date')[:5].values(
                'id', 'company_name', 'status', 'registration_date'
            )
            
            vendor_data['recent'] = list(recent_vendors)
            
            data['vendors'] = vendor_data
            
        # Inventory summary
        if settings.show_inventory:
            inventory_data = {}
            
            # Low stock items
            low_stock = InventoryItem.objects.filter(
                current_quantity__lte=F('minimum_quantity'),
                is_active=True
            ).values('id', 'name', 'current_quantity', 'minimum_quantity')
            
            inventory_data['low_stock'] = list(low_stock)
            
            # Recent transactions
            recent_transactions = InventoryTransaction.objects.select_related(
                'item', 'created_by'
            ).order_by('-transaction_date')[:10].values(
                'id', 'item__name', 'transaction_type', 'quantity', 
                'transaction_date', 'created_by__username'
            )
            
            inventory_data['recent_transactions'] = list(recent_transactions)
            
            data['inventory'] = inventory_data
            
        # Purchase Order summary
        if settings.show_orders:
            orders_data = {}
            
            # Count by status
            status_counts = PurchaseOrder.objects.filter(
                date_created__gte=start_date
            ).values('status').annotate(count=Count('id'))
            
            orders_data['status_counts'] = {item['status']: item['count'] for item in status_counts}
            
            # Recent orders
            recent_orders = PurchaseOrder.objects.select_related('vendor').filter(
                date_created__gte=start_date
            ).order_by('-date_created')[:5].values(
                'id', 'po_number', 'vendor__company_name', 'status', 
                'date_created', 'grand_total'
            )
            
            orders_data['recent'] = list(recent_orders)
            
            # Total spend by month (for the past year)
            year_ago = timezone.now() - timedelta(days=365)
            monthly_spend = PurchaseOrder.objects.filter(
                date_created__gte=year_ago,
                status__in=['partial', 'complete']
            ).extra(
                select={'month': "EXTRACT(month FROM date_created)"}
            ).values('month').annotate(
                total=Sum('grand_total')
            ).order_by('month')
            
            orders_data['monthly_spend'] = list(monthly_spend)
            
            data['orders'] = orders_data
            
        # Notifications
        unread_count = Notification.objects.filter(
            user=request.user,
            read=False
        ).count()
        
        data['unread_notifications'] = unread_count
        
        return Response(data)

class DashboardSettingsView(generics.RetrieveUpdateAPIView):
    """API endpoint for retrieving and updating dashboard settings."""
    serializer_class = DashboardSettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        settings, created = DashboardSettings.objects.get_or_create(
            user=self.request.user,
            defaults={
                'show_requisitions': True,
                'show_vendors': True,
                'show_inventory': True,
                'show_orders': True,
                'default_date_range': 30
            }
        )
        return settings

class NotificationListView(generics.ListAPIView):
    """API endpoint for listing notifications."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        
        # Filter by read status if specified
        read = self.request.query_params.get('read')
        if read is not None:
            read = read.lower() == 'true'
            queryset = queryset.filter(read=read)
            
        return queryset.order_by('-created_at')

class MarkNotificationReadView(APIView):
    """API endpoint for marking a notification as read."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        notification = get_object_or_404(
            Notification, 
            pk=pk, 
            user=request.user
        )
        
        notification.read = True
        notification.save()
        
        return Response({
            'message': 'Notification marked as read'
        }, status=status.HTTP_200_OK)

class SavedReportListView(generics.ListCreateAPIView):
    """API endpoint for listing and creating saved reports."""
    serializer_class = SavedReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedReport.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, and deleting a saved report."""
    serializer_class = SavedReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedReport.objects.filter(user=self.request.user)

class GenerateReportView(APIView):
    """API endpoint for generating reports."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        report_type = request.data.get('report_type')
        parameters = request.data.get('parameters', {})
        save_report = request.data.get('save_report', False)
        report_name = request.data.get('report_name', '')
        
        # Generate report data based on type
        if report_type == 'requisitions':
            data = self._generate_requisitions_report(parameters)
        elif report_type == 'inventory':
            data = self._generate_inventory_report(parameters)
        elif report_type == 'vendors':
            data = self._generate_vendors_report(parameters)
        elif report_type == 'purchases':
            data = self._generate_purchases_report(parameters)
        else:
            return Response({
                'error': 'Invalid report type'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the report if requested
        if save_report and report_name:
            SavedReport.objects.create(
                user=request.user,
                name=report_name,
                report_type=report_type,
                parameters=parameters,
                last_run=timezone.now()
            )
        
        return Response(data)
    
    def _generate_requisitions_report(self, parameters):
        # Example implementation - customize based on your needs
        queryset = Requisition.objects.all()
        
        # Apply filters from parameters
        status = parameters.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        start_date = parameters.get('start_date')
        if start_date:
            queryset = queryset.filter(date_created__gte=start_date)
            
        end_date = parameters.get('end_date')
        if end_date:
            queryset = queryset.filter(date_created__lte=end_date)
            
        department = parameters.get('department')
        if department:
            queryset = queryset.filter(department=department)
        
        # Generate report data
        total_count = queryset.count()
        total_value = queryset.aggregate(total=Sum('total_estimated_cost'))['total'] or 0
        
        by_status = queryset.values('status').annotate(
            count=Count('id'),
            value=Sum('total_estimated_cost')
        )
        
        by_department = queryset.values('department').annotate(
            count=Count('id'),
            value=Sum('total_estimated_cost')
        )
        
        by_priority = queryset.values('priority').annotate(
            count=Count('id'),
            value=Sum('total_estimated_cost')
        )
        
        return {
            'total_count': total_count,
            'total_value': float(total_value),
            'by_status': list(by_status),
            'by_department': list(by_department),
            'by_priority': list(by_priority),
        }
    
    def _generate_inventory_report(self, parameters):
        # Example implementation - customize based on your needs
        queryset = InventoryItem.objects.all()
        
        # Apply filters from parameters
        category_id = parameters.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        is_active = parameters.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
            
        needs_reorder = parameters.get('needs_reorder')
        if needs_reorder:
            queryset = queryset.filter(current_quantity__lte=F('minimum_quantity'))
        
        # Generate report data
        total_count = queryset.count()
        total_value = queryset.aggregate(
            total=Sum(F('current_quantity') * F('unit_price'))
        )['total'] or 0
        
        by_category = queryset.values('category__name').annotate(
            count=Count('id'),
            value=Sum(F('current_quantity') * F('unit_price')),
            quantity=Sum('current_quantity')
        )
        
        items_detail = queryset.values(
            'name', 'sku', 'current_quantity', 'minimum_quantity',
            'unit_price', 'is_active', 'category__name'
        ).annotate(
            value=F('current_quantity') * F('unit_price'),
            needs_reorder=Case(
                When(current_quantity__lte=F('minimum_quantity'), then=True),
                default=False,
                output_field=BooleanField()
            )
        )
        
        return {
            'total_count': total_count,
            'total_value': float(total_value),
            'by_category': list(by_category),
            'items': list(items_detail),
        }
    
    def _generate_vendors_report(self, parameters):
        # Implementation for vendors report
        queryset = Vendor.objects.all()
        
        # Apply filters
        status = parameters.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        category_id = parameters.get('category_id')
        if category_id:
            queryset = queryset.filter(categories__id=category_id)
        
        # Basic counts
        total_count = queryset.count()
        by_status = queryset.values('status').annotate(count=Count('id'))
        
        # Get purchase orders by vendor
        po_by_vendor = PurchaseOrder.objects.values(
            'vendor__company_name', 'vendor__id'
        ).annotate(
            total_orders=Count('id'),
            total_value=Sum('grand_total')
        ).order_by('-total_value')[:10]
        
        return {
            'total_count': total_count,
            'by_status': list(by_status),
            'top_vendors_by_orders': list(po_by_vendor),
        }
    
    def _generate_purchases_report(self, parameters):
        # Implementation for purchases report
        queryset = PurchaseOrder.objects.all()
        
        # Apply filters
        status = parameters.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        start_date = parameters.get('start_date')
        if start_date:
            queryset = queryset.filter(date_created__gte=start_date)
            
        end_date = parameters.get('end_date')
        if end_date:
            queryset = queryset.filter(date_created__lte=end_date)
            
        vendor_id = parameters.get('vendor_id')
        if vendor_id:
            queryset = queryset.filter(vendor_id=vendor_id)
        
        # Generate report data
        total_count = queryset.count()
        total_value = queryset.aggregate(total=Sum('grand_total'))['total'] or 0
        
        by_status = queryset.values('status').annotate(
            count=Count('id'),
            value=Sum('grand_total')
        )
        
        by_vendor = queryset.values(
            'vendor__company_name'
        ).annotate(
            count=Count('id'),
            value=Sum('grand_total')
        ).order_by('-value')
        
        monthly_breakdown = queryset.extra(
            select={'month': "EXTRACT(month FROM date_created)"}
        ).values('month').annotate(
            count=Count('id'),
            value=Sum('grand_total')
        ).order_by('month')
        
        return {
            'total_count': total_count,
            'total_value': float(total_value),
            'by_status': list(by_status),
            'by_vendor': list(by_vendor),
            'monthly_breakdown': list(monthly_breakdown),
        }