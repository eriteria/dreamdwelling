"""
Serializers for favorites app.
"""

from rest_framework import serializers
from .models import Favorite, SavedSearch
from properties.serializers import PropertyListSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for user favorites."""
    
    property_details = PropertyListSerializer(source='property', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'property', 'property_details', 'created_at', 'notes']
        read_only_fields = ['id', 'created_at']


class SavedSearchSerializer(serializers.ModelSerializer):
    """Serializer for saved searches."""
    
    class Meta:
        model = SavedSearch
        fields = ['id', 'name', 'search_params', 'created_at', 'last_run',
                  'notify_new_listings', 'notify_price_changes', 'notify_status_changes']
        read_only_fields = ['id', 'created_at', 'last_run']
