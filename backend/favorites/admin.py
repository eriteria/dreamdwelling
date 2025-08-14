"""
Admin configuration for favorites app.
"""

from django.contrib import admin
from .models import Favorite, SavedSearch


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    """Admin configuration for Favorite model."""

    list_display = ["user", "property", "created_at"]
    list_filter = ["created_at"]
    search_fields = [
        "user__email",
        "user__first_name",
        "user__last_name",
        "property__title",
    ]
    raw_id_fields = ["user", "property"]
    readonly_fields = ["created_at"]

    fieldsets = (
        (None, {"fields": ("user", "property", "notes")}),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )


@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    """Admin configuration for SavedSearch model."""

    list_display = ["user", "name", "created_at", "last_run"]
    list_filter = ["created_at", "last_run"]
    search_fields = ["user__email", "user__first_name", "user__last_name", "name"]
    raw_id_fields = ["user"]
    readonly_fields = ["created_at"]

    fieldsets = (
        ("Basic Information", {"fields": ("user", "name", "search_params")}),
        (
            "Timestamps",
            {"fields": ("created_at", "last_run"), "classes": ("collapse",)},
        ),
    )
