from django.urls import path
from .views import (
    InventoryItemListView, InventoryItemDetailView, 
    CategoryListView, CategoryDetailView,
    InventoryTransactionView, LowStockItemsView
)

urlpatterns = [
    path('', InventoryItemListView.as_view(), name='inventory-list'),
    path('<int:pk>/', InventoryItemDetailView.as_view(), name='inventory-detail'),
    path('categories/', CategoryListView.as_view(), name='inventory-categories'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('<int:item_id>/transactions/', InventoryTransactionView.as_view(), name='inventory-transactions'),
    path('low-stock/', LowStockItemsView.as_view(), name='low-stock-items'),
]