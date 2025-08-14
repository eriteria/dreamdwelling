"""
Views for search functionality.
"""

from rest_framework import views, permissions, status
from rest_framework.response import Response

# Restored GIS imports for spatial functionality
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from django.db.models import Q
from properties.models import Property
from properties.serializers import PropertyListSerializer
import math  # Keep this for fallback calculations


class PropertiesSearchView(views.APIView):
    """API endpoint for advanced property searches."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Handle GET request for property search."""
        # Extract query parameters
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius = request.query_params.get("radius", 10)  # Default 10km

        # Basic query
        queryset = Property.objects.all()

        # Apply geospatial search if coordinates provided
        if lat and lng:
            try:
                lat = float(lat)
                lng = float(lng)
                radius = float(radius)

                # Create a point from the provided coordinates
                point = Point(lng, lat, srid=4326)

                # Use GIS distance query to find properties within the radius
                queryset = (
                    queryset.filter(location__distance_lt=(point, D(km=radius)))
                    .annotate(distance=Distance("location", point))
                    .order_by("distance")
                )

                # Fallback to manual calculation if no results (may happen if properties don't have location but have lat/long)
                if not queryset.exists():
                    # Manual distance calculation using Haversine formula
                    def haversine_distance(lat1, lon1, lat2, lon2):
                        # Convert decimal degrees to radians
                        lat1, lon1, lat2, lon2 = map(
                            math.radians, [lat1, lon1, lat2, lon2]
                        )
                        # Haversine formula
                        dlon = lon2 - lon1
                        dlat = lat2 - lat1
                        a = (
                            math.sin(dlat / 2) ** 2
                            + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
                        )
                        c = 2 * math.asin(math.sqrt(a))
                        # Radius of earth in kilometers is 6371
                        km = 6371 * c
                        return km

                    # Get properties within radius using lat/long fields
                    filtered_properties = []
                    queryset = Property.objects.all()  # Reset queryset
                    for property in queryset:
                        if (
                            property.latitude is not None
                            and property.longitude is not None
                        ):
                            distance = haversine_distance(
                                lat, lng, property.latitude, property.longitude
                            )
                        if distance <= radius:
                            property.distance = distance
                            filtered_properties.append(property)

                # Sort by distance
                filtered_properties.sort(key=lambda x: x.distance)
                queryset = filtered_properties
            except (ValueError, TypeError):
                pass  # Invalid coordinates, skip geo filtering

        # Apply other filters - using Property's filter backend logic would be better
        # but keeping it simple for this example
        property_type = request.query_params.get("property_type")
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")
        min_bedrooms = request.query_params.get("min_bedrooms")
        max_bedrooms = request.query_params.get("max_bedrooms")
        min_bathrooms = request.query_params.get("min_bathrooms")
        max_bathrooms = request.query_params.get("max_bathrooms")

        if property_type:
            queryset = queryset.filter(property_type__id=property_type)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if min_bedrooms:
            queryset = queryset.filter(bedrooms__gte=min_bedrooms)

        if max_bedrooms:
            queryset = queryset.filter(bedrooms__lte=max_bedrooms)

        if min_bathrooms:
            queryset = queryset.filter(bathrooms__gte=min_bathrooms)

        if max_bathrooms:
            queryset = queryset.filter(bathrooms__lte=max_bathrooms)

        # Get page number and size
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 20))

        # Manual pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        results = queryset[start_index:end_index]

        # Serialize data
        serializer = PropertyListSerializer(
            results, many=True, context={"request": request}
        )

        # Return response with pagination info
        return Response(
            {
                "count": queryset.count(),
                "page": page,
                "page_size": page_size,
                "results": serializer.data,
            }
        )


class AutocompleteSearchView(views.APIView):
    """API endpoint for location search autocomplete."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Handle GET request for location autocomplete."""
        query = request.query_params.get("query", "")
        if len(query) < 3:
            return Response([])

        # Simple location search against cities, states, zip codes
        results = (
            Property.objects.filter(
                Q(city__istartswith=query)
                | Q(state__istartswith=query)
                | Q(zip_code__startswith=query)
            )
            .values("city", "state", "zip_code")
            .distinct()[:10]
        )

        # Format the results for autocomplete
        locations = []
        for item in results:
            location = f"{item['city']}, {item['state']} {item['zip_code']}"
            if location not in locations:
                locations.append(
                    {
                        "display": location,
                        "city": item["city"],
                        "state": item["state"],
                        "zip_code": item["zip_code"],
                    }
                )

        return Response(locations)
