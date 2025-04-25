from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Vendor, VendorCategory, VendorDocument

User = get_user_model()

class VendorCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorCategory
        fields = ('id', 'name', 'description')

class VendorRegistrationSerializer(serializers.ModelSerializer):
    user_data = serializers.JSONField(write_only=True)
    
    class Meta:
        model = Vendor
        fields = ('company_name', 'company_registration_number', 'tax_identification_number',
                 'address', 'city', 'state', 'postal_code', 'country', 'website', 
                 'categories', 'user_data')
        
    def create(self, validated_data):
        user_data = validated_data.pop('user_data')
        categories = validated_data.pop('categories', [])
        
        # Create user account
        user = User.objects.create(
            username=user_data.get('username'),
            email=user_data.get('email'),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            role='vendor'
        )
        user.set_password(user_data.get('password'))
        user.save()
        
        # Create vendor profile
        vendor = Vendor.objects.create(user=user, **validated_data)
        
        # Add categories
        if categories:
            vendor.categories.set(categories)
        
        return vendor

class VendorSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    categories = VendorCategorySerializer(many=True, read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    
    class Meta:
        model = Vendor
        fields = ('id', 'company_name', 'company_registration_number', 'tax_identification_number',
                 'address', 'city', 'state', 'postal_code', 'country', 'website', 
                 'categories', 'status', 'registration_date', 'approved_date',
                 'approved_by', 'approved_by_name', 'user_details')
        read_only_fields = ('registration_date', 'approved_date', 'approved_by', 'status')
    
    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'phone_number': obj.user.phone_number
        }

class VendorDocumentSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)
    
    class Meta:
        model = VendorDocument
        fields = ('id', 'vendor', 'vendor_name', 'document_type', 'document', 
                  'uploaded_at', 'is_verified')
        read_only_fields = ('uploaded_at', 'is_verified', 'vendor')