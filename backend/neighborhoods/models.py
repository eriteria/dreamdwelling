"""
Models for neighborhood data.
"""

from django.db import models
from django.contrib.gis.db import models as gis_models


class Neighborhood(models.Model):
    """Model for neighborhood data."""

    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_codes = models.CharField(max_length=255)  # Comma-separated list of zip codes
    # Restored PolygonField for spatial functionality
    boundary = gis_models.PolygonField(null=True, blank=True)
    # Keep JSON field for compatibility with existing data
    boundary_points = models.JSONField(
        null=True, blank=True
    )  # Store polygon points as JSON

    # Overview
    description = models.TextField(blank=True)
    median_home_price = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    median_rent = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )

    # Demographics
    population = models.PositiveIntegerField(null=True, blank=True)
    median_age = models.DecimalField(
        max_digits=4, decimal_places=1, null=True, blank=True
    )
    median_income = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    # Market trends
    price_growth_1yr = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )  # Percentage
    rent_growth_1yr = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )  # Percentage

    # Misc
    walk_score = models.PositiveSmallIntegerField(null=True, blank=True)  # 0-100
    transit_score = models.PositiveSmallIntegerField(null=True, blank=True)  # 0-100
    bike_score = models.PositiveSmallIntegerField(null=True, blank=True)  # 0-100

    def __str__(self):
        return f"{self.name}, {self.city}, {self.state}"


class School(models.Model):
    """Model for school data."""

    LEVEL_CHOICES = [
        ("elementary", "Elementary School"),
        ("middle", "Middle School"),
        ("high", "High School"),
        ("charter", "Charter School"),
        ("private", "Private School"),
    ]

    name = models.CharField(max_length=255)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    neighborhood = models.ForeignKey(
        Neighborhood, on_delete=models.CASCADE, related_name="schools"
    )
    address = models.CharField(max_length=255)
    # Restore GIS PointField while keeping lat/long for compatibility
    location = gis_models.PointField(null=True, blank=True)
    # Keep these fields for compatibility with existing data
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    website = models.URLField(blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-10 rating
    enrollment = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_level_display()})"


class PointOfInterest(models.Model):
    """Model for points of interest (restaurants, parks, etc.)."""

    CATEGORY_CHOICES = [
        ("restaurant", "Restaurant"),
        ("cafe", "Cafe"),
        ("grocery", "Grocery Store"),
        ("retail", "Retail"),
        ("park", "Park"),
        ("gym", "Gym"),
        ("hospital", "Hospital"),
        ("pharmacy", "Pharmacy"),
        ("entertainment", "Entertainment"),
        ("transit", "Transit"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    neighborhood = models.ForeignKey(
        Neighborhood, on_delete=models.CASCADE, related_name="points_of_interest"
    )
    address = models.CharField(max_length=255)
    # Restore GIS PointField while keeping lat/long for compatibility
    location = gis_models.PointField(null=True, blank=True)
    # Keep these fields for compatibility with existing data
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, null=True, blank=True
    )  # 0-5 rating

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class CrimeData(models.Model):
    """Model for crime statistics."""

    neighborhood = models.OneToOneField(
        Neighborhood, on_delete=models.CASCADE, related_name="crime_data"
    )

    # Crime rates per 100k residents
    violent_crime_rate = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    property_crime_rate = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )

    # Safety score
    safety_score = models.PositiveSmallIntegerField(null=True, blank=True)  # 0-100

    # Year of data
    data_year = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"Crime Data for {self.neighborhood.name} ({self.data_year})"
