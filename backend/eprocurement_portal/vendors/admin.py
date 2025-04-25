from django.contrib import admin
from .models import Vendor, VendorCategory, VendorDocument

class VendorDocumentInline(admin.TabularInline):
    model = VendorDocument
    extra = 1

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'status', 'registration_date')
    list_filter = ('status', 'categories')
    search_fields = ('company_name', 'user__username', 'company_registration_number')
    inlines = [VendorDocumentInline]

@admin.register(VendorCategory)
class VendorCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(VendorDocument)
class VendorDocumentAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'document_type', 'uploaded_at', 'is_verified')
    list_filter = ('is_verified', 'document_type')
    search_fields = ('vendor__company_name',)