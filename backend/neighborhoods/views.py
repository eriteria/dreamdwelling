"""
Views for neighborhood data.
"""

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

# Restored GIS imports for spatial functionality
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from django.shortcuts import get_object_or_404
from .models import Neighborhood, School, PointOfInterest
import math
from .serializers import (
    NeighborhoodListSerializer,
    NeighborhoodDetailSerializer,
    SchoolSerializer,
    PointOfInterestSerializer,
)


class NeighborhoodViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for neighborhoods."""

    queryset = Neighborhood.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        """Return appropriate serializer class."""
        if self.action == "list":
            return NeighborhoodListSerializer
        return NeighborhoodDetailSerializer

    @action(detail=False, methods=["get"])
    def near_location(self, request):
        """Find neighborhoods near a specific location."""
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius = request.query_params.get("radius", 5)  # Default 5km radius

        if not lat or not lng:
            return Response(
                {"error": "lat and lng parameters are required"}, status=400
            )

        try:
            lat = float(lat)
            lng = float(lng)
            radius = float(radius)
        except ValueError:
            return Response({"error": "Invalid coordinates or radius"}, status=400)

        # Create a point from the provided coordinates
        point = Point(lng, lat, srid=4326)

        # Find neighborhoods within the radius
        neighborhoods = (
            Neighborhood.objects.filter(boundary__distance_lt=(point, D(km=radius)))
            .annotate(distance=Distance("boundary", point))
            .order_by("distance")[:10]
        )  # Get 10 nearest neighborhoods

        serializer = NeighborhoodListSerializer(
            neighborhoods, many=True, context={"request": request}
        )
        return Response(serializer.data)


class SchoolViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for schools."""

    serializer_class = SchoolSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Return schools, optionally filtered by neighborhood."""
        queryset = School.objects.all()
        neighborhood_id = self.request.query_params.get("neighborhood")
        if neighborhood_id:
            queryset = queryset.filter(neighborhood_id=neighborhood_id)
        return queryset


class PointOfInterestViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for points of interest."""

    serializer_class = PointOfInterestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Return points of interest, optionally filtered by neighborhood and category."""
        queryset = PointOfInterest.objects.all()

        neighborhood_id = self.request.query_params.get("neighborhood")
        if neighborhood_id:
            queryset = queryset.filter(neighborhood_id=neighborhood_id)

        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)

        return queryset
