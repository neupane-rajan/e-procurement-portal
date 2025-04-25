from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .models import Vendor, VendorCategory, VendorDocument
from .serializers import (
    VendorSerializer, VendorRegistrationSerializer, 
    VendorCategorySerializer, VendorDocumentSerializer
)
from users.permissions import IsAdminUser, IsProcurementOfficer, IsVendor

class VendorRegistrationView(generics.CreateAPIView):
    """API endpoint for registering a new vendor."""
    queryset = Vendor.objects.all()
    serializer_class = VendorRegistrationSerializer
    permission_classes = [IsAuthenticated]

class VendorProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for retrieving and updating a vendor's profile."""
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        if self.request.user.role == 'vendor':
            return get_object_or_404(Vendor, user=self.request.user)
        else:
            # For admin/procurement officers who want to view/edit any vendor
            vendor_id = self.request.query_params.get('id')
            if vendor_id and (self.request.user.role == 'admin' or self.request.user.role == 'procurement_officer'):
                return get_object_or_404(Vendor, id=vendor_id)
            return get_object_or_404(Vendor, user=self.request.user)

class VendorListView(generics.ListAPIView):
    """API endpoint for listing all vendors."""
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'user__username', 'company_registration_number']
    ordering_fields = ['company_name', 'registration_date', 'status']
    ordering = ['company_name']
    
    def get_queryset(self):
        queryset = Vendor.objects.all()
        
        # Filter by status if provided
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        # Filter by category if provided
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(categories__id=category_id)
            
        return queryset

class VendorApprovalView(generics.UpdateAPIView):
    """API endpoint for approving or rejecting a vendor."""
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]
    lookup_url_kwarg = 'vendor_id'
    
    def update(self, request, *args, **kwargs):
        vendor = self.get_object()
        action = request.data.get('action')
        
        if action == 'approve':
            vendor.status = Vendor.APPROVED
            vendor.approved_by = request.user
            vendor.approved_date = timezone.now()
            vendor.save()
            return Response({
                'message': f'Vendor {vendor.company_name} has been approved.'
            }, status=status.HTTP_200_OK)
        elif action == 'reject':
            vendor.status = Vendor.REJECTED
            vendor.save()
            return Response({
                'message': f'Vendor {vendor.company_name} has been rejected.'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid action. Use "approve" or "reject".'
            }, status=status.HTTP_400_BAD_REQUEST)

class VendorCategoryListView(generics.ListCreateAPIView):
    """API endpoint for listing and creating vendor categories."""
    queryset = VendorCategory.objects.all()
    serializer_class = VendorCategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsProcurementOfficer]
        return super().get_permissions()

class VendorDocumentView(generics.ListCreateAPIView):
    """API endpoint for managing vendor documents."""
    serializer_class = VendorDocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        vendor_id = self.kwargs.get('vendor_id')
        
        # Ensure the user has permission to view these documents
        if self.request.user.role in ['admin', 'procurement_officer']:
            return VendorDocument.objects.filter(vendor_id=vendor_id)
        else:
            # Vendors can only view their own documents
            vendor = get_object_or_404(Vendor, user=self.request.user)
            if vendor.id == int(vendor_id):
                return VendorDocument.objects.filter(vendor_id=vendor_id)
            return VendorDocument.objects.none()
    
    def perform_create(self, serializer):
        vendor_id = self.kwargs.get('vendor_id')
        vendor = get_object_or_404(Vendor, id=vendor_id)
        
        # Check if the current user is the vendor or an admin/procurement officer
        if self.request.user == vendor.user or self.request.user.role in ['admin', 'procurement_officer']:
            serializer.save(vendor=vendor)
        else:
            raise PermissionError("You don't have permission to upload documents for this vendor.")

class VendorDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for viewing, updating, and deleting a specific vendor document."""
    serializer_class = VendorDocumentSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'document_id'
    
    def get_queryset(self):
        vendor_id = self.kwargs.get('vendor_id')
        document_id = self.kwargs.get('document_id')
        
        if self.request.user.role in ['admin', 'procurement_officer']:
            return VendorDocument.objects.filter(vendor_id=vendor_id, id=document_id)
        else:
            # Vendors can only access their own documents
            vendor = get_object_or_404(Vendor, user=self.request.user)
            if vendor.id == int(vendor_id):
                return VendorDocument.objects.filter(vendor_id=vendor_id, id=document_id)
            return VendorDocument.objects.none()