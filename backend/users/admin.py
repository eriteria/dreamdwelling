"""
Admin configuration for users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserAddress


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for custom User model."""

    list_display = [
        "email",
        "username",
        "first_name",
        "last_name",
        "is_agent",
        "is_staff",
        "date_joined",
    ]
    list_filter = ["is_staff", "is_superuser", "is_active", "is_agent", "date_joined"]
    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-date_joined"]

    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone_number",
                    "bio",
                    "profile_picture",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Agent info", {"fields": ("is_agent", "license_number", "brokerage")}),
        ("Preferences", {"fields": ("email_notifications",)}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    """Admin configuration for UserAddress model."""

    list_display = ["user", "address_line1", "city", "state", "zip_code", "is_default"]
    list_filter = ["is_default", "state", "country"]
    search_fields = [
        "user__email",
        "user__first_name",
        "user__last_name",
        "address_line1",
        "city",
    ]
    raw_id_fields = ["user"]
