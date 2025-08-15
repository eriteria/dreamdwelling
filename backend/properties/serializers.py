"""
Serializers for property models.
"""

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import (
    Property,
    PropertyImage,
    PropertyDocument,
    PropertyType,
    Feature,
    PropertyReview,
    OpenHouse,
)
from users.serializers import UserSerializer


class FeatureSerializer(serializers.ModelSerializer):
    """Serializer for property features."""

    class Meta:
        model = Feature
        fields = ["id", "name", "category", "icon"]


class PropertyTypeSerializer(serializers.ModelSerializer):
    """Serializer for property types."""

    class Meta:
        model = PropertyType
        fields = ["id", "name", "description"]


class PropertyImageSerializer(serializers.ModelSerializer):
    """Serializer for property images."""

    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "caption", "is_primary", "order"]

    def get_image(self, obj):
        """Return the image URL, handling both local files and external URLs."""
        if obj.image:
            # If it's already a full URL (starts with http), return as-is
            if str(obj.image).startswith(("http://", "https://")):
                return str(obj.image)
            # Otherwise, build the full URL for local files
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PropertyDocumentSerializer(serializers.ModelSerializer):
    """Serializer for property documents."""

    class Meta:
        model = PropertyDocument
        fields = ["id", "title", "file", "document_type"]


class PropertyReviewSerializer(serializers.ModelSerializer):
    """Serializer for property reviews."""

    user = UserSerializer(read_only=True)

    class Meta:
        model = PropertyReview
        fields = ["id", "user", "rating", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]


class OpenHouseSerializer(serializers.ModelSerializer):
    """Serializer for open house events."""

    hosted_by = UserSerializer(read_only=True)

    class Meta:
        model = OpenHouse
        fields = ["id", "start_time", "end_time", "description", "hosted_by"]
        read_only_fields = ["id"]


class PropertyListSerializer(GeoFeatureModelSerializer):
    """Serializer for listing properties."""

    property_type_name = serializers.CharField(
        source="property_type.name", read_only=True
    )
    primary_image = serializers.SerializerMethodField()
    images = PropertyImageSerializer(many=True, read_only=True)
    favorite_count = serializers.IntegerField(source="favorites_count", read_only=True)

    class Meta:
        model = Property
        geo_field = "location"
        fields = [
            "id",
            "title",
            "address_line1",
            "city",
            "state",
            "zip_code",
            "price",
            "monthly_rent",
            "bedrooms",
            "bathrooms",
            "square_feet",
            "status",
            "listing_type",
            "property_type_name",
            "primary_image",
            "images",
            "favorite_count",
            "created_at",
            "location",  # Include the geo field
        ]

    def get_primary_image(self, obj):
        """Get the primary image URL for the property."""
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            # If it's already a full URL (starts with http), return as-is
            if str(primary.image).startswith(("http://", "https://")):
                return str(primary.image)
            # Otherwise, build the full URL for local files
            return self.context["request"].build_absolute_uri(primary.image.url)

        # If no primary image, get the first one
        first_image = obj.images.first()
        if first_image:
            # If it's already a full URL (starts with http), return as-is
            if str(first_image.image).startswith(("http://", "https://")):
                return str(first_image.image)
            # Otherwise, build the full URL for local files
            return self.context["request"].build_absolute_uri(first_image.image.url)

        return None


class PropertyDetailSerializer(GeoFeatureModelSerializer):
    """Serializer for property details."""

    images = PropertyImageSerializer(many=True, read_only=True)
    documents = PropertyDocumentSerializer(many=True, read_only=True)
    reviews = PropertyReviewSerializer(many=True, read_only=True)
    open_houses = OpenHouseSerializer(many=True, read_only=True)
    features = FeatureSerializer(many=True, read_only=True)
    property_type = PropertyTypeSerializer(read_only=True)
    listed_by = UserSerializer(read_only=True)

    class Meta:
        model = Property
        geo_field = "location"
        fields = "__all__"


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating properties."""

    class Meta:
        model = Property
        exclude = [
            "listed_by",
            "created_at",
            "updated_at",
            "views_count",
            "favorites_count",
        ]

    def create(self, validated_data):
        """Create a new property with the current user as the lister."""
        validated_data["listed_by"] = self.context["request"].user
        return super().create(validated_data)
