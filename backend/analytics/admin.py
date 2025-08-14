"""
Admin configuration for analytics app.
"""

from django.contrib import admin
from .models import MarketTrend, PropertyValuation


@admin.register(MarketTrend)
class MarketTrendAdmin(admin.ModelAdmin):
    """Admin configuration for MarketTrend model."""

    list_display = ["city", "state", "period", "date", "median_price", "avg_price"]
    list_filter = ["period", "date", "state"]
    search_fields = ["city", "state", "zip_code"]
    date_hierarchy = "date"

    fieldsets = (
        ("Location", {"fields": ("city", "state", "zip_code")}),
        ("Time Period", {"fields": ("period", "date")}),
        ("Price Metrics", {"fields": ("median_price", "avg_price", "price_per_sqft")}),
        (
            "Volume Metrics",
            {"fields": ("total_sales", "total_listings", "days_on_market")},
        ),
    )


@admin.register(PropertyValuation)
class PropertyValuationAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyValuation model."""

    list_display = [
        "address_line1",
        "city",
        "state",
        "estimated_value",
        "confidence_score",
        "last_updated",
    ]
    list_filter = ["state", "confidence_score", "last_updated"]
    search_fields = ["address_line1", "city", "state", "zip_code"]
    readonly_fields = ["last_updated"]
    date_hierarchy = "last_updated"

    fieldsets = (
        (
            "Property Location",
            {"fields": ("address_line1", "address_line2", "city", "state", "zip_code")},
        ),
        (
            "Property Details",
            {
                "fields": (
                    "bedrooms",
                    "bathrooms",
                    "square_feet",
                    "lot_size",
                    "year_built",
                )
            },
        ),
        (
            "Valuation Data",
            {
                "fields": (
                    "estimated_value",
                    "estimated_rent",
                    "confidence_score",
                    "last_updated",
                )
            },
        ),
        ("History", {"fields": ("valuation_history",), "classes": ("collapse",)}),
    )
