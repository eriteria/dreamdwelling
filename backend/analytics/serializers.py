"""
Serializers for market analytics and trends.
"""

from rest_framework import serializers
from .models import MarketTrend, PropertyValuation


class MarketTrendSerializer(serializers.ModelSerializer):
    """Serializer for market trends."""
    
    class Meta:
        model = MarketTrend
        fields = '__all__'


class PropertyValuationSerializer(serializers.ModelSerializer):
    """Serializer for property valuations."""
    
    class Meta:
        model = PropertyValuation
        fields = '__all__'
        read_only_fields = ['estimated_value', 'estimated_rent', 'confidence_score', 'last_updated', 'valuation_history']
