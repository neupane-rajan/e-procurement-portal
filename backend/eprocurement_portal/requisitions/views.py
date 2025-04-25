from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Sum
from django.utils import timezone
from .models import Requisition, RequisitionItem, RequisitionApproval, RequisitionStatus
from .serializers import (
    RequisitionSerializer, RequisitionCreateSerializer, 
    RequisitionItemSerializer, RequisitionApprovalSerializer
)
from users.permissions import IsProcurementOfficer, IsAdminUser

class RequisitionListView(generics.ListAPIView):
    """API endpoint for listing requisitions."""
    serializer_class = RequisitionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'department', 'requester__username']
    ordering_fields = ['date_created', 'priority', 'department', 'status']
    ordering = ['-date_created']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Requisition.objects.all()
        
        # Filter based on user role
        if user.role == 'procurement_officer' or user.role == 'admin':
            # Show all requisitions for admin and procurement officers
            pass
        else:
            # Regular users only see their own requisitions
            queryset = queryset.filter(requester=user)
        
        # Apply filters from query parameters
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department=department)
            
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
            
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(date_created__gte=start_date)
            
        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(date_created__lte=end_date)
            
        return queryset

class RequisitionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, and deleting a requisition."""
    queryset = Requisition.objects.all()
    serializer_class = RequisitionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Only allow edits/deletes by the requester, procurement officers, or admins
            if self.get_object().requester == self.request.user:
                self.permission_classes = [IsAuthenticated]
            else:
                self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'procurement_officer']:
            return Requisition.objects.all()
        return Requisition.objects.filter(
            Q(requester=user) | Q(approvals__approver=user)
        ).distinct()
    
    def update(self, request, *args, **kwargs):
        # Don't allow editing of completed or cancelled requisitions
        requisition = self.get_object()
        if requisition.status in [RequisitionStatus.COMPLETED, RequisitionStatus.CANCELLED]:
            return Response({
                'error': f'Cannot update requisition in {requisition.status} state.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # If a procurement officer is updating the status, handle accordingly
        if request.user.role in ['admin', 'procurement_officer']:
            new_status = request.data.get('status')
            if new_status and new_status != requisition.status:
                requisition.status = new_status
                requisition.save()
                
                # Create approval entry for status changes
                if new_status == RequisitionStatus.APPROVED:
                    RequisitionApproval.objects.get_or_create(
                        requisition=requisition,
                        approver=request.user,
                        defaults={'approved': True, 'comments': request.data.get('comments', 'Approved')}
                    )
                elif new_status == RequisitionStatus.REJECTED:
                    RequisitionApproval.objects.get_or_create(
                        requisition=requisition,
                        approver=request.user,
                        defaults={'approved': False, 'comments': request.data.get('comments', 'Rejected')}
                    )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Don't allow deletion of approved/ordered requisitions
        requisition = self.get_object()
        if requisition.status not in [RequisitionStatus.DRAFT, RequisitionStatus.PENDING_APPROVAL]:
            return Response({
                'error': f'Cannot delete requisition in {requisition.status} state.'
            }, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

class RequisitionCreateView(generics.CreateAPIView):
    """API endpoint for creating a new requisition."""
    serializer_class = RequisitionCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)
        
        # Update status to PENDING_APPROVAL if submitted
        submit = self.request.data.get('submit', False)
        if submit:
            requisition = serializer.instance
            requisition.status = RequisitionStatus.PENDING_APPROVAL
            requisition.save()

class RequisitionApprovalView(APIView):
    """API endpoint for approving or rejecting requisitions."""
    permission_classes = [IsAuthenticated, IsProcurementOfficer]
    
    def post(self, request, pk):
        requisition = get_object_or_404(Requisition, pk=pk)
        approved = request.data.get('approved', False)
        comments = request.data.get('comments', '')
        
        # Don't allow approval actions on non-pending requisitions
        if requisition.status != RequisitionStatus.PENDING_APPROVAL:
            return Response({
                'error': f'Cannot approve/reject requisition in {requisition.status} state.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if this user has already approved/rejected
        approval, created = RequisitionApproval.objects.get_or_create(
            requisition=requisition,
            approver=request.user,
            defaults={
                'approved': approved,
                'comments': comments
            }
        )
        
        if not created:
            approval.approved = approved
            approval.comments = comments
            approval.save()
        
        # Check if approved
        if approved:
            # If approved by an admin, mark as approved
            if request.user.role == 'admin':
                requisition.status = RequisitionStatus.APPROVED
                requisition.save()
                return Response({
                    'message': 'Requisition has been approved.'
                }, status=status.HTTP_200_OK)
            
            # Logic for multi-level approval - for now just count approvals
            # In a real system, you'd check against approval workflow rules
            approval_count = RequisitionApproval.objects.filter(
                requisition=requisition, approved=True
            ).count()
            
            # If we have at least 2 approvals, mark as approved
            # (This is just an example - adjust based on your requirements)
            if approval_count >= 2:
                requisition.status = RequisitionStatus.APPROVED
                requisition.save()
                return Response({
                    'message': 'Requisition has been approved with multiple approvers.'
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'Approval recorded. Awaiting additional approvals.'
            }, status=status.HTTP_200_OK)
        else:
            # If rejected, update status immediately
            requisition.status = RequisitionStatus.REJECTED
            requisition.save()
            return Response({
                'message': 'Requisition has been rejected.'
            }, status=status.HTTP_200_OK)

class RequisitionItemView(generics.ListCreateAPIView):
    """API endpoint for listing and adding items to a requisition."""
    serializer_class = RequisitionItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        requisition_id = self.kwargs.get('requisition_id')
        return RequisitionItem.objects.filter(requisition_id=requisition_id)
    
    def perform_create(self, serializer):
        requisition_id = self.kwargs.get('requisition_id')
        requisition = get_object_or_404(Requisition, id=requisition_id)
        
        # Only allow adding items to draft requisitions
        if requisition.status != RequisitionStatus.DRAFT:
            raise PermissionError("Can only add items to draft requisitions.")
        
        # Ensure user has rights to add items
        if self.request.user != requisition.requester and self.request.user.role not in ['admin', 'procurement_officer']:
            raise PermissionError("You don't have permission to add items to this requisition.")
        
        serializer.save(requisition=requisition)

class RequisitionItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for managing a specific requisition item."""
    serializer_class = RequisitionItemSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'item_id'
    
    def get_queryset(self):
        requisition_id = self.kwargs.get('requisition_id')
        item_id = self.kwargs.get('item_id')
        return RequisitionItem.objects.filter(requisition_id=requisition_id, id=item_id)
    
    def perform_update(self, serializer):
        requisition = serializer.instance.requisition
        
        # Only allow updates to draft requisitions
        if requisition.status != RequisitionStatus.DRAFT:
            raise PermissionError("Can only update items in draft requisitions.")
        
        # Ensure user has rights to update items
        if self.request.user != requisition.requester and self.request.user.role not in ['admin', 'procurement_officer']:
            raise PermissionError("You don't have permission to update items in this requisition.")
        
        serializer.save()
    
    def perform_destroy(self, instance):
        requisition = instance.requisition
        
        # Only allow deletes on draft requisitions
        if requisition.status != RequisitionStatus.DRAFT:
            raise PermissionError("Can only delete items from draft requisitions.")
        
        # Ensure user has rights to delete items
        if self.request.user != requisition.requester and self.request.user.role not in ['admin', 'procurement_officer']:
            raise PermissionError("You don't have permission to delete items from this requisition.")
        
        instance.delete()