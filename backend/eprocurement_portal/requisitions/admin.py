from django.contrib import admin
from .models import Requisition, RequisitionItem, RequisitionApproval

class RequisitionItemInline(admin.TabularInline):
    model = RequisitionItem
    extra = 1

class RequisitionApprovalInline(admin.TabularInline):
    model = RequisitionApproval
    extra = 1

@admin.register(Requisition)
class RequisitionAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'requester', 'status', 'date_created', 'date_needed', 'priority')
    list_filter = ('status', 'priority', 'department')
    search_fields = ('title', 'requester__username', 'department')
    inlines = [RequisitionItemInline, RequisitionApprovalInline]
    readonly_fields = ('total_estimated_cost',)

@admin.register(RequisitionItem)
class RequisitionItemAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'requisition', 'quantity', 'unit_of_measure', 'estimated_unit_price', 'estimated_cost')
    list_filter = ('unit_of_measure',)
    search_fields = ('item_name', 'description', 'requisition__title')

@admin.register(RequisitionApproval)
class RequisitionApprovalAdmin(admin.ModelAdmin):
    list_display = ('requisition', 'approver', 'approved', 'approval_date')
    list_filter = ('approved',)
    search_fields = ('requisition__title', 'approver__username')