"""
Admin configuration for properties app.
"""

import json
from django.contrib import admin
from django.contrib import messages
from django.contrib.gis.admin import GISModelAdmin
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q
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
    search_fields = ["name"]


class PropertyImageInline(admin.TabularInline):
    """Inline admin for property images."""

    model = PropertyImage
    extra = 1
    fields = ("image", "caption", "is_primary", "order")


class PropertyDocumentInline(admin.TabularInline):
    """Inline admin for property documents."""

    model = PropertyDocument
    extra = 1
    fields = ("title", "file", "document_type")


class PropertyReviewInline(admin.TabularInline):
    """Inline admin for property reviews."""

    model = PropertyReview
    extra = 0
    readonly_fields = ["created_at"]
    fields = ("user", "rating", "comment", "created_at")


class OpenHouseInline(admin.TabularInline):
    """Inline admin for open houses."""

    model = OpenHouse
    extra = 1
    fields = ("start_time", "end_time", "description")


@admin.register(Property)
class PropertyAdmin(GISModelAdmin):
    """Admin configuration for Property model with GIS support."""

    # GIS Configuration
    gis_widget_kwargs = {
        "attrs": {
            "map_width": 800,
            "map_height": 600,
        }
    }
    default_lon = -98.5795  # Center of USA
    default_lat = 39.8283
    default_zoom = 4
    map_template = "gis/admin/openlayers.html"

    change_form_template = "admin/properties/property/change_form.html"  # Custom template for property edit page

    # Add map view actions
    actions = ["view_on_map", "view_on_google_map", "run_map_diagnostics"]

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
        "created_at",
    ]
    search_fields = [
        "title",
        "description",
        "address_line1",
        "city",
        "state",
        "zip_code",
    ]
    readonly_fields = ["created_at", "updated_at", "views_count"]

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
                    "address_line1",
                    "address_line2",
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
                    "pets_allowed",
                    "furnished",
                    "features",
                )
            },
        ),
        (
            "Media",
            {
                "fields": ("virtual_tour_url",),
                "description": "Images are managed through the Images inline section below.",
            },
        ),
        (
            "Metadata",
            {
                "fields": (
                    "views_count",
                    "favorites_count",
                    "created_at",
                    "updated_at",
                ),
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

    def get_urls(self):
        """Add custom URLs for the property admin."""
        urls = super().get_urls()
        custom_urls = [
            path(
                "map-view/",
                self.admin_site.admin_view(self.map_view),
                name="property_map_view",
            ),
            path(
                "map-test/",
                self.admin_site.admin_view(self.map_test_view),
                name="property_map_test",
            ),
            path(
                "map-debug/",
                self.admin_site.admin_view(self.map_debug_view),
                name="property_map_debug",
            ),
            path(
                "leaflet-test/",
                self.admin_site.admin_view(self.leaflet_test_view),
                name="property_leaflet_test",
            ),
            path(
                "standalone-map/",
                self.admin_site.admin_view(self.standalone_map_view),
                name="property_standalone_map",
            ),
            path(
                "basic-map/",
                self.admin_site.admin_view(self.basic_map_view),
                name="property_basic_map",
            ),
            path(
                "google-map/",
                self.admin_site.admin_view(self.google_map_view),
                name="property_google_map",
            ),
            path(
                "property/<int:property_id>/map/",
                self.admin_site.admin_view(self.single_property_map_view),
                name="property_single_map",
            ),
            path(
                "map-diagnostics/",
                self.admin_site.admin_view(self.map_diagnostics_view),
                name="property_map_diagnostics",
            ),
        ]
        return custom_urls + urls

    def map_test_view(self, request):
        """Simple test view for the map functionality."""
        context = {
            "title": "Map Test Page",
            "media": self.media,
        }
        return render(request, "admin/properties/property/map_test.html", context)

    def map_debug_view(self, request):
        """Debugging view for the map functionality."""
        import random

        context = {
            "title": "Map Debug Page",
            "media": self.media,
            "random_version": random.randint(10000, 99999),  # Cache busting
        }
        return render(request, "admin/properties/property/map_debug.html", context)

    def leaflet_test_view(self, request):
        """Simple HTML test for Leaflet."""
        context = {}
        return render(request, "admin/properties/property/leaflet_test.html", context)

    def standalone_map_view(self, request):
        """Standalone map test with properties."""
        context = {}
        return render(request, "admin/properties/property/standalone_map.html", context)

    def basic_map_view(self, request):
        """Simple map view using Django's OpenLayers."""
        properties = Property.objects.all()

        # Prepare data for JavaScript
        property_data = []
        for prop in properties:
            if prop.latitude and prop.longitude:
                property_data.append(
                    {
                        "id": prop.id,
                        "title": prop.title,
                        "address": f"{prop.address_line1}, {prop.city}, {prop.state}",
                        "lat": float(prop.latitude),
                        "lng": float(prop.longitude),
                        "price": float(prop.price),
                        "bedrooms": prop.bedrooms,
                        "bathrooms": float(prop.bathrooms),
                        "square_feet": prop.square_feet,
                        "status": prop.status,
                    }
                )

        # Convert to JSON
        properties_json = json.dumps(property_data, cls=DjangoJSONEncoder)

        context = {
            "title": "Basic Property Map",
            "properties_json": properties_json,
            "media": self.media,
        }

        return render(request, "admin/properties/property/basic_map.html", context)

    def google_map_view(self, request):
        """Map view using Google Maps."""
        # Get filter parameters
        status = request.GET.get("status", "")
        listing_type = request.GET.get("listing_type", "")
        min_price = request.GET.get("min_price", "")
        max_price = request.GET.get("max_price", "")
        min_bedrooms = request.GET.get("min_bedrooms", "")
        min_bathrooms = request.GET.get("min_bathrooms", "")
        city = request.GET.get("city", "")
        state = request.GET.get("state", "")

        # Check if specific property IDs were passed
        property_ids = request.GET.getlist("id")

        if property_ids:
            # If specific IDs were passed, show only those properties
            properties = Property.objects.filter(id__in=property_ids)
        else:
            # Otherwise apply filters
            filters = Q()
            if status:
                filters &= Q(status=status)
            if listing_type:
                filters &= Q(listing_type=listing_type)
            if min_price:
                filters &= Q(price__gte=min_price)
            if max_price:
                filters &= Q(price__lte=max_price)
            if min_bedrooms:
                filters &= Q(bedrooms__gte=min_bedrooms)
            if min_bathrooms:
                filters &= Q(bathrooms__gte=min_bathrooms)
            if city:
                filters &= Q(city__icontains=city)
            if state:
                filters &= Q(state__icontains=state)

            # Get properties with coordinates
            properties = Property.objects.filter(filters)

        # Prepare data for JSON
        property_data = []
        for prop in properties:
            if prop.latitude and prop.longitude:
                property_data.append(
                    {
                        "id": prop.id,
                        "title": prop.title,
                        "address_line1": prop.address_line1,
                        "city": prop.city,
                        "state": prop.state,
                        "latitude": float(prop.latitude),
                        "longitude": float(prop.longitude),
                        "price": float(prop.price),
                        "bedrooms": prop.bedrooms,
                        "bathrooms": float(prop.bathrooms),
                        "square_feet": prop.square_feet,
                        "status": prop.status,
                        "listing_type": prop.listing_type,
                    }
                )

        # Convert to JSON
        properties_json = json.dumps(property_data, cls=DjangoJSONEncoder)

        context = {
            "title": "Property Map View",
            "properties": properties,
            "properties_json": properties_json,
            # Include original filter parameters to maintain state
            "filters": {
                "status": status,
                "listing_type": listing_type,
                "min_price": min_price,
                "max_price": max_price,
                "min_bedrooms": min_bedrooms,
                "min_bathrooms": min_bathrooms,
                "city": city,
                "state": state,
            },
            # Pass map style from a method for easier customization
            "map_style": self.get_map_style(),
            # Include media
            "media": self.media,
            # Example API key placeholder (replace with your actual key in production)
            # "google_maps_api_key": "YOUR_API_KEY_HERE",
        }

        return render(
            request, "admin/properties/property/google_map_view.html", context
        )

    def single_property_map_view(self, request, property_id):
        """View a single property on a map."""
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            messages.error(request, "Property not found.")
            return redirect("admin:properties_property_changelist")

        if not property.latitude or not property.longitude:
            messages.warning(request, "This property doesn't have coordinates set.")
            return redirect("admin:properties_property_change", property_id)

        context = {
            "title": f"Map View: {property.title}",
            "property": property,
            "map_style": self.get_map_style(),
            # Example API key placeholder (replace with your actual key in production)
            # "google_maps_api_key": "YOUR_API_KEY_HERE",
            "media": self.media,
        }

        return render(
            request, "admin/properties/property/single_property_map.html", context
        )

    def map_diagnostics_view(self, request):
        """View to run diagnostic tests on map functionality."""
        context = {
            "title": "Map Diagnostics",
            "map_style": self.get_map_style(),
            # Example API key placeholder (replace with your actual key in production)
            # "google_maps_api_key": "YOUR_API_KEY_HERE",
            "media": self.media,
        }
        return render(
            request, "admin/properties/property/map_diagnostics.html", context
        )

    def map_view(self, request, selected_ids=None):
        """Custom view that shows properties on a map."""
        # Get filter parameters
        status = request.GET.get("status", "")
        listing_type = request.GET.get("listing_type", "")
        min_price = request.GET.get("min_price", "")
        max_price = request.GET.get("max_price", "")
        min_bedrooms = request.GET.get("min_bedrooms", "")
        min_bathrooms = request.GET.get("min_bathrooms", "")
        city = request.GET.get("city", "")
        state = request.GET.get("state", "")

        # Build query filters
        filters = Q()
        if status:
            filters &= Q(status=status)
        if listing_type:
            filters &= Q(listing_type=listing_type)
        if min_price:
            filters &= Q(price__gte=min_price)
        if max_price:
            filters &= Q(price__lte=max_price)
        if min_bedrooms:
            filters &= Q(bedrooms__gte=min_bedrooms)
        if min_bathrooms:
            filters &= Q(bathrooms__gte=min_bathrooms)
        if city:
            filters &= Q(city__icontains=city)
        if state:
            filters &= Q(state__icontains=state)

        # Get properties with coordinates
        if selected_ids:
            properties = Property.objects.filter(id__in=selected_ids)
        else:
            properties = Property.objects.filter(filters)

        # Prepare data for JSON
        property_data = []
        for prop in properties:
            if prop.latitude and prop.longitude:
                property_data.append(
                    {
                        "id": prop.id,
                        "title": prop.title,
                        "address_line1": prop.address_line1,
                        "city": prop.city,
                        "state": prop.state,
                        "latitude": float(prop.latitude),
                        "longitude": float(prop.longitude),
                        "price": float(prop.price),
                        "bedrooms": prop.bedrooms,
                        "bathrooms": float(prop.bathrooms),
                        "square_feet": prop.square_feet,
                        "status": prop.status,
                        "listing_type": prop.listing_type,
                    }
                )

        # Convert to JSON
        properties_json = json.dumps(property_data, cls=DjangoJSONEncoder)

        context = {
            "title": "Property Map View",
            "properties": properties,
            "properties_json": properties_json,
            # Include original filter parameters to maintain state
            "filters": {
                "status": status,
                "listing_type": listing_type,
                "min_price": min_price,
                "max_price": max_price,
                "min_bedrooms": min_bedrooms,
                "min_bathrooms": min_bathrooms,
                "city": city,
                "state": state,
            },
            # Include media
            "media": self.media,
        }

        return render(request, "admin/properties/property/map_view.html", context)

    def view_on_map(self, request, queryset):
        """Admin action to view selected properties on map."""
        selected = request.POST.getlist("_selected_action")
        return self.map_view(request, selected_ids=selected)

    view_on_map.short_description = "View selected properties on map"

    def view_on_google_map(self, request, queryset):
        """Admin action to view selected properties on Google Maps."""
        if queryset.count() == 1:
            # If only one property is selected, go to the single property map view
            property = queryset.first()
            return redirect("admin:property_single_map", property_id=property.id)
        else:
            # If multiple properties are selected, pass their IDs to the Google Maps view
            selected_ids = request.POST.getlist("_selected_action")
            base_url = reverse("admin:property_google_map")
            id_params = "&".join([f"id={id}" for id in selected_ids])
            return redirect(f"{base_url}?{id_params}")

    view_on_google_map.short_description = "View on Google Maps"

    def run_map_diagnostics(self, request, queryset):
        """Admin action to run map diagnostics."""
        return redirect("admin:property_map_diagnostics")

    run_map_diagnostics.short_description = "Run map diagnostics"

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

    def get_map_style(self):
        """Return a JSON string of map styles for Google Maps."""
        return """
        [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"weight": "2.00"}]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#9c9c9c"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#7b7b7b"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#c8d7d4"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#070707"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            }
        ]
        """


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyImage model."""

    list_display = ["property", "caption", "is_primary", "order"]
    list_filter = ["is_primary"]
    search_fields = ["property__title", "caption"]


@admin.register(PropertyDocument)
class PropertyDocumentAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyDocument model."""

    list_display = ["property", "title", "document_type"]
    list_filter = ["document_type"]
    search_fields = ["property__title", "title", "document_type"]


@admin.register(PropertyReview)
class PropertyReviewAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyReview model."""

    list_display = ["property", "user", "rating", "created_at"]
    list_filter = ["rating", "created_at"]
    search_fields = ["property__title", "user__username", "comment"]
    readonly_fields = ["created_at"]


@admin.register(OpenHouse)
class OpenHouseAdmin(admin.ModelAdmin):
    """Admin configuration for OpenHouse model."""

    list_display = ["property", "start_time", "end_time"]
    list_filter = ["start_time"]
    search_fields = ["property__title", "description"]
