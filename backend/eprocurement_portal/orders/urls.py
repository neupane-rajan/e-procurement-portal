from django.urls import path
from .views import (
    PurchaseOrderListView, PurchaseOrderDetailView, PurchaseOrderCreateView,
    ShipmentListView, ShipmentDetailView, ShipmentReceiveView,
    PurchaseOrderItemListView
)

urlpatterns = [
    path('', PurchaseOrderListView.as_view(), name='purchase-order-list'),
    path('create/', PurchaseOrderCreateView.as_view(), name='purchase-order-create'),
    path('<int:pk>/', PurchaseOrderDetailView.as_view(), name='purchase-order-detail'),
    path('<int:purchase_order_id>/items/', PurchaseOrderItemListView.as_view(), name='purchase-order-items'),
    path('shipments/', ShipmentListView.as_view(), name='shipment-list'),
    path('shipments/<int:pk>/', ShipmentDetailView.as_view(), name='shipment-detail'),
    path('shipments/<int:pk>/receive/', ShipmentReceiveView.as_view(), name='shipment-receive'),
]