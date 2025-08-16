"""
Admin configuration for properties app.
"""

from django.contrib import admin
from .models import (
    PropertyType,
    Feature,
    Property,
    PropertyImage,
    PropertyDocument,
    PropertyReview,
    OpenHouse,
)


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyType model."""

    list_display = ["name", "description"]
    search_fields = ["name", "description"]


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    """Admin configuration for Feature model."""

    list_display = ["name", "category", "icon"]
    list_filter = ["category"]
    search_fields = ["name", "description"]


class PropertyImageInline(admin.TabularInline):
    """Inline admin for property images."""

    model = PropertyImage
    extra = 1
    fields = ("image", "caption", "is_primary")


class PropertyDocumentInline(admin.TabularInline):
    """Inline admin for property documents."""

    model = PropertyDocument
    extra = 1


class PropertyReviewInline(admin.TabularInline):
    """Inline admin for property reviews."""

    model = PropertyReview
    extra = 0
    readonly_fields = ["date_created"]


class OpenHouseInline(admin.TabularInline):
    """Inline admin for open houses."""

    model = OpenHouse
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Admin configuration for Property model."""

    list_display = [
        "title",
        "city",
        "state",
        "price",
        "property_type",
        "status",
        "listing_type",
        "listed_by",
    ]
    list_filter = [
        "status",
        "listing_type",
        "property_type",
        "state",
        "has_air_conditioning",
        "has_heating",
        "has_garage",
        "date_created",
    ]
    search_fields = [
        "title",
        "description",
        "address",
        "city",
        "state",
        "zip_code",
    ]
    readonly_fields = ["date_created", "date_updated", "views"]

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "title",
                    "description",
                    "property_type",
                    "listing_type",
                    "status",
                    "listed_by",
                )
            },
        ),
        (
            "Location",
            {
                "fields": (
                    "address",
                    "city",
                    "state",
                    "zip_code",
                    "latitude",
                    "longitude",
                ),
                "description": "Enter latitude and longitude for map display. Location field will be auto-synced.",
            },
        ),
        (
            "Property Details",
            {
                "fields": (
                    "price",
                    "bedrooms",
                    "bathrooms",
                    "square_feet",
                    "lot_size",
                    "year_built",
                )
            },
        ),
        (
            "Features",
            {
                "fields": (
                    "has_air_conditioning",
                    "has_heating",
                    "has_garage",
                    "features",
                )
            },
        ),
        ("Media", {"fields": ("primary_image",)}),
        (
            "Metadata",
            {
                "fields": ("views", "date_created", "date_updated"),
                "classes": ("collapse",),
            },
        ),
    )

    filter_horizontal = ["features"]

    inlines = [
        PropertyImageInline,
        PropertyDocumentInline,
        PropertyReviewInline,
        OpenHouseInline,
    ]

    def save_model(self, request, obj, form, change):
        """Custom save to handle location field synchronization."""
        # Sync location field if lat/lng are provided
        if obj.latitude and obj.longitude:
            try:
                from django.contrib.gis.geos import Point

                obj.location = Point(obj.longitude, obj.latitude)
            except Exception:
                # If GIS is not available, skip location sync
                pass
        super().save_model(request, obj, form, change)


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyImage model."""

    list_display = ["property", "caption", "is_primary", "date_uploaded"]
    list_filter = ["is_primary", "date_uploaded"]
    search_fields = ["property__title", "caption"]


@admin.register(PropertyDocument)
class PropertyDocumentAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyDocument model."""

    list_display = ["property", "document_type", "date_uploaded"]
    list_filter = ["document_type", "date_uploaded"]
    search_fields = ["property__title", "document_type"]


@admin.register(PropertyReview)
class PropertyReviewAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyReview model."""

    list_display = ["property", "reviewer_name", "rating", "date_created"]
    list_filter = ["rating", "date_created"]
    search_fields = ["property__title", "reviewer_name", "review_text"]
    readonly_fields = ["date_created"]


@admin.register(OpenHouse)
class OpenHouseAdmin(admin.ModelAdmin):
    """Admin configuration for OpenHouse model."""

    list_display = ["property", "start_time", "end_time", "date_created"]
    list_filter = ["start_time", "date_created"]
    search_fields = ["property__title"]
