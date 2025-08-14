"""
Views for market analytics and trends.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Max, Min
from .models import MarketTrend, PropertyValuation
from .serializers import MarketTrendSerializer, PropertyValuationSerializer
from properties.models import Property


class MarketTrendViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for market trends."""
    
    serializer_class = MarketTrendSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return market trends, filtered by location and period."""
        queryset = MarketTrend.objects.all()
        
        # Filter by location
        city = self.request.query_params.get('city')
        state = self.request.query_params.get('state')
        zip_code = self.request.query_params.get('zip_code')
        
        if city:
            queryset = queryset.filter(city__iexact=city)
        if state:
            queryset = queryset.filter(state__iexact=state)
        if zip_code:
            queryset = queryset.filter(zip_code=zip_code)
            
        # Filter by period
        period = self.request.query_params.get('period')
        if period:
            queryset = queryset.filter(period=period)
            
        # Limit results
        limit = int(self.request.query_params.get('limit', 12))
        return queryset[:limit]
    
    @action(detail=False, methods=['get'])
    def market_summary(self, request):
        """Get a summary of the current market conditions."""
        city = request.query_params.get('city')
        state = request.query_params.get('state')
        
        if not city or not state:
            return Response({"error": "city and state parameters are required"}, status=400)
        
        # Get the most recent monthly trend
        recent_trend = MarketTrend.objects.filter(
            city__iexact=city,
            state__iexact=state,
            period='monthly'
        ).order_by('-date').first()
        
        if not recent_trend:
            return Response({"error": "No market data available for this location"}, status=404)
        
        # Get active listings count and stats
        active_listings = Property.objects.filter(
            city__iexact=city,
            state__iexact=state,
            status='available'
        )
        
        listing_stats = {
            'count': active_listings.count(),
            'avg_price': active_listings.aggregate(Avg('price'))['price__avg'],
            'min_price': active_listings.aggregate(Min('price'))['price__min'],
            'max_price': active_listings.aggregate(Max('price'))['price__max'],
        }
        
        # Combine data
        market_summary = {
            'trend': MarketTrendSerializer(recent_trend).data,
            'active_listings': listing_stats
        }
        
        return Response(market_summary)


class PropertyValuationViewSet(viewsets.ModelViewSet):
    """API endpoint for property valuations."""
    
    serializer_class = PropertyValuationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return property valuations, filtered by address."""
        queryset = PropertyValuation.objects.all()
        
        address = self.request.query_params.get('address')
        if address:
            queryset = queryset.filter(address_line1__icontains=address)
            
        zip_code = self.request.query_params.get('zip_code')
        if zip_code:
            queryset = queryset.filter(zip_code=zip_code)
            
        return queryset
    
    @action(detail=False, methods=['post'])
    def estimate(self, request):
        """Generate a valuation estimate for a property."""
        serializer = PropertyValuationSerializer(data=request.data)
        
        if serializer.is_valid():
            # In a real implementation, this would call a valuation model or service
            # Here we'll just create a placeholder with some sample logic
            
            # Simplified sample calculation (not realistic)
            square_feet = serializer.validated_data.get('square_feet', 0)
            bedrooms = serializer.validated_data.get('bedrooms', 0)
            bathrooms = serializer.validated_data.get('bathrooms', 0)
            year_built = serializer.validated_data.get('year_built', 2000)
            
            # Very simplified estimation
            base_value = square_feet * 200  # $200 per sq ft
            bedroom_value = bedrooms * 15000  # $15k per bedroom
            bathroom_value = bathrooms * 10000  # $10k per bathroom
            age_adjustment = (2023 - year_built) * -500  # -$500 per year of age
            
            estimated_value = max(base_value + bedroom_value + bathroom_value + age_adjustment, 50000)
            estimated_rent = estimated_value * 0.005  # 0.5% of value for monthly rent
            
            # Create the valuation
            instance = serializer.save(
                estimated_value=estimated_value,
                estimated_rent=estimated_rent,
                confidence_score=75  # Placeholder confidence score
            )
            
            return Response(PropertyValuationSerializer(instance).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
