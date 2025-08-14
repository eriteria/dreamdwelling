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
    search_fields = ["name", "category"]


class PropertyImageInline(admin.TabularInline):
    """Inline admin for PropertyImage."""

    model = PropertyImage
    extra = 1


class PropertyDocumentInline(admin.TabularInline):
    """Inline admin for PropertyDocument."""

    model = PropertyDocument
    extra = 1


class PropertyReviewInline(admin.TabularInline):
    """Inline admin for PropertyReview."""

    model = PropertyReview
    extra = 0
    readonly_fields = ["created_at"]


class OpenHouseInline(admin.TabularInline):
    """Inline admin for OpenHouse."""

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
        "pets_allowed",
        "furnished",
    ]
    search_fields = [
        "title",
        "description",
        "address_line1",
        "city",
        "state",
        "zip_code",
    ]
    raw_id_fields = ["listed_by", "property_type"]
    filter_horizontal = ["features"]

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("title", "description", "property_type", "listed_by")},
        ),
        (
            "Location",
            {
                "fields": (
                    "address_line1",
                    "address_line2",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                    "location",
                )
            },
        ),
        (
            "Property Details",
            {
                "fields": (
                    "price",
                    "price_per_sqft",
                    "monthly_rent",
                    "bedrooms",
                    "bathrooms",
                    "square_feet",
                    "lot_size",
                    "year_built",
                )
            },
        ),
        ("Listing Details", {"fields": ("status", "listing_type", "features")}),
        (
            "Amenities",
            {
                "fields": (
                    "has_air_conditioning",
                    "has_heating",
                    "pets_allowed",
                    "furnished",
                )
            },
        ),
        (
            "Stats",
            {"fields": ("views_count", "favorites_count"), "classes": ("collapse",)},
        ),
    )

    inlines = [
        PropertyImageInline,
        PropertyDocumentInline,
        PropertyReviewInline,
        OpenHouseInline,
    ]


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyImage model."""

    list_display = ["property", "caption", "is_primary", "order"]
    list_filter = ["is_primary"]
    search_fields = ["property__title", "caption"]
    raw_id_fields = ["property"]


@admin.register(PropertyDocument)
class PropertyDocumentAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyDocument model."""

    list_display = ["property", "title", "document_type"]
    list_filter = ["document_type"]
    search_fields = ["property__title", "title", "document_type"]
    raw_id_fields = ["property"]


@admin.register(PropertyReview)
class PropertyReviewAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyReview model."""

    list_display = ["property", "user", "rating", "created_at"]
    list_filter = ["rating", "created_at"]
    search_fields = ["property__title", "user__email", "comment"]
    raw_id_fields = ["property", "user"]
    readonly_fields = ["created_at"]


@admin.register(OpenHouse)
class OpenHouseAdmin(admin.ModelAdmin):
    """Admin configuration for OpenHouse model."""

    list_display = ["property", "start_time", "end_time", "hosted_by"]
    list_filter = ["start_time"]
    search_fields = ["property__title", "description"]
    raw_id_fields = ["property", "hosted_by"]
