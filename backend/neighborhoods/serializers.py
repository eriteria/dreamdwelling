"""
Serializers for neighborhood data.
"""

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Neighborhood, School, PointOfInterest, CrimeData


class CrimeDataSerializer(serializers.ModelSerializer):
    """Serializer for crime data."""

    class Meta:
        model = CrimeData
        fields = [
            "violent_crime_rate",
            "property_crime_rate",
            "safety_score",
            "data_year",
        ]


class SchoolSerializer(GeoFeatureModelSerializer):
    """Serializer for schools."""

    level_display = serializers.CharField(source="get_level_display", read_only=True)

    class Meta:
        model = School
        geo_field = "location"
        fields = [
            "id",
            "name",
            "level",
            "level_display",
            "address",
            "location",
            "latitude",
            "longitude",
            "website",
            "rating",
            "enrollment",
        ]


class PointOfInterestSerializer(GeoFeatureModelSerializer):
    """Serializer for points of interest."""

    category_display = serializers.CharField(
        source="get_category_display", read_only=True
    )

    class Meta:
        model = PointOfInterest
        geo_field = "location"
        fields = [
            "id",
            "name",
            "category",
            "category_display",
            "address",
            "location",
            "latitude",
            "longitude",
            "rating",
        ]


class NeighborhoodListSerializer(GeoFeatureModelSerializer):
    """Serializer for neighborhood list views."""

    class Meta:
        model = Neighborhood
        geo_field = "boundary"
        fields = [
            "id",
            "name",
            "city",
            "state",
            "zip_codes",
            "boundary",
            "boundary_points",
            "median_home_price",
            "median_rent",
            "walk_score",
        ]


class NeighborhoodDetailSerializer(GeoFeatureModelSerializer):
    """Serializer for neighborhood detail view."""

    crime_data = CrimeDataSerializer(read_only=True)
    schools = SchoolSerializer(many=True, read_only=True)
    points_of_interest = PointOfInterestSerializer(many=True, read_only=True)

    class Meta:
        model = Neighborhood
        geo_field = "boundary"
        fields = [
            "id",
            "name",
            "city",
            "state",
            "zip_codes",
            "boundary",
            "boundary_points",
            "description",
            "median_home_price",
            "median_rent",
            "population",
            "median_age",
            "median_income",
            "price_growth_1yr",
            "rent_growth_1yr",
            "walk_score",
            "transit_score",
            "bike_score",
            "crime_data",
            "schools",
            "points_of_interest",
        ]
