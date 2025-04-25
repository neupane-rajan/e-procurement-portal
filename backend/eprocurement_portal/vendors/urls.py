from django.urls import path
from .views import (
    VendorRegistrationView, VendorProfileView, VendorListView,
    VendorApprovalView, VendorCategoryListView, 
    VendorDocumentView, VendorDocumentDetailView
)

urlpatterns = [
    path('register/', VendorRegistrationView.as_view(), name='vendor-register'),
    path('profile/', VendorProfileView.as_view(), name='vendor-profile'),
    path('categories/', VendorCategoryListView.as_view(), name='vendor-categories'),
    path('<int:vendor_id>/approve/', VendorApprovalView.as_view(), name='vendor-approve'),
    path('<int:vendor_id>/documents/', VendorDocumentView.as_view(), name='vendor-documents'),
    path('<int:vendor_id>/documents/<int:document_id>/', VendorDocumentDetailView.as_view(), name='vendor-document-detail'),
    path('', VendorListView.as_view(), name='vendor-list'),
]