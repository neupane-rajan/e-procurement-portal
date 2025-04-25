from django.urls import path
from .views import (
    RequisitionListView, RequisitionDetailView, RequisitionCreateView,
    RequisitionApprovalView, RequisitionItemView, RequisitionItemDetailView
)

urlpatterns = [
    path('', RequisitionListView.as_view(), name='requisition-list'),
    path('create/', RequisitionCreateView.as_view(), name='requisition-create'),
    path('<int:pk>/', RequisitionDetailView.as_view(), name='requisition-detail'),
    path('<int:pk>/approve/', RequisitionApprovalView.as_view(), name='requisition-approve'),
    path('<int:requisition_id>/items/', RequisitionItemView.as_view(), name='requisition-items'),
    path('<int:requisition_id>/items/<int:item_id>/', RequisitionItemDetailView.as_view(), name='requisition-item-detail'),
]