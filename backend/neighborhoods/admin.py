"""
Admin configuration for neighborhoods app.
"""

from django.contrib import admin
from .models import Neighborhood, School, PointOfInterest, CrimeData


@admin.register(Neighborhood)
class NeighborhoodAdmin(admin.ModelAdmin):
    """Admin configuration for Neighborhood model."""

    list_display = [
        "name",
        "city",
        "state",
        "population",
        "median_income",
        "walk_score",
    ]
    list_filter = ["state"]
    search_fields = ["name", "city", "state", "description"]

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "name",
                    "description",
                    "city",
                    "state",
                    "zip_codes",
                    "boundary",
                )
            },
        ),
        ("Demographics", {"fields": ("population", "median_age", "median_income")}),
        (
            "Housing Market",
            {
                "fields": (
                    "median_home_price",
                    "median_rent",
                    "price_growth_1yr",
                    "rent_growth_1yr",
                )
            },
        ),
        ("Walkability", {"fields": ("walk_score",)}),
    )


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    """Admin configuration for School model."""

    list_display = ["name", "level", "rating", "neighborhood"]
    list_filter = ["level", "rating", "neighborhood"]
    search_fields = ["name", "address", "neighborhood__name"]
    raw_id_fields = ["neighborhood"]


@admin.register(PointOfInterest)
class PointOfInterestAdmin(admin.ModelAdmin):
    """Admin configuration for PointOfInterest model."""

    list_display = ["name", "category", "neighborhood", "rating"]
    list_filter = ["category", "rating", "neighborhood"]
    search_fields = ["name", "description", "address", "neighborhood__name"]
    raw_id_fields = ["neighborhood"]


@admin.register(CrimeData)
class CrimeDataAdmin(admin.ModelAdmin):
    """Admin configuration for CrimeData model."""

    list_display = ["neighborhood"]
    search_fields = ["neighborhood__name"]
    raw_id_fields = ["neighborhood"]
