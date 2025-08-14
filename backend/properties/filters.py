"""
Custom filters for DreamDwelling.
"""

import django_filters
from .models import Property


class PropertyFilter(django_filters.FilterSet):
    """Filter set for Property model."""
    
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_bedrooms = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='gte')
    max_bedrooms = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='lte')
    min_bathrooms = django_filters.NumberFilter(field_name='bathrooms', lookup_expr='gte')
    max_bathrooms = django_filters.NumberFilter(field_name='bathrooms', lookup_expr='lte')
    min_square_feet = django_filters.NumberFilter(field_name='square_feet', lookup_expr='gte')
    max_square_feet = django_filters.NumberFilter(field_name='square_feet', lookup_expr='lte')
    year_built_min = django_filters.NumberFilter(field_name='year_built', lookup_expr='gte')
    year_built_max = django_filters.NumberFilter(field_name='year_built', lookup_expr='lte')
    has_virtual_tour = django_filters.BooleanFilter(field_name='virtual_tour_url', lookup_expr='isnull', exclude=True)
    features = django_filters.CharFilter(field_name='features__name', lookup_expr='iexact')
    
    class Meta:
        model = Property
        fields = [
            'property_type', 'status', 'listing_type', 'city', 'state', 'zip_code',
            'has_air_conditioning', 'has_heating', 'pets_allowed', 'furnished',
        ]
