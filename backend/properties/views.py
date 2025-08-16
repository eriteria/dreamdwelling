"""
Views for property listings in DreamDwelling.
"""

from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import (
    Property,
    PropertyType,
    Feature,
    PropertyImage,
    PropertyDocument,
    PropertyReview,
    OpenHouse,
)
from .serializers import (
    PropertyListSerializer,
    PropertyDetailSerializer,
    PropertyTypeSerializer,
    FeatureSerializer,
    PropertyImageSerializer,
    PropertyDocumentSerializer,
    PropertyReviewSerializer,
    OpenHouseSerializer,
    PropertyCreateUpdateSerializer,
)
from .permissions import IsOwnerOrReadOnly
from .filters import PropertyFilter


class PropertyViewSet(viewsets.ModelViewSet):
    """API endpoint for properties."""

    queryset = Property.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = PropertyFilter
    search_fields = [
        "title",
        "description",
        "address_line1",
        "city",
        "state",
        "zip_code",
    ]
    ordering_fields = ["price", "created_at", "bedrooms", "bathrooms", "square_feet"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        """Return appropriate serializer class."""
        if self.action == "list":
            return PropertyListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return PropertyCreateUpdateSerializer
        return PropertyDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        """Increment views count on property retrieve."""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=["views_count"])
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def add_images(self, request, pk=None):
        """Add images to a property."""
        property_instance = self.get_object()

        # Check if the user owns this property
        if property_instance.listed_by != request.user:
            return Response(
                {
                    "detail": "You do not have permission to add images to this property."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Check if primary image is being set
        is_primary = request.data.get("is_primary", False)
        if is_primary:
            # Unset any existing primary image
            PropertyImage.objects.filter(
                property=property_instance, is_primary=True
            ).update(is_primary=False)

        serializer = PropertyImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(property=property_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def add_document(self, request, pk=None):
        """Add a document to a property."""
        property_instance = self.get_object()

        # Check if the user owns this property
        if property_instance.listed_by != request.user:
            return Response(
                {
                    "detail": "You do not have permission to add documents to this property."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = PropertyDocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(property=property_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def add_review(self, request, pk=None):
        """Add a review to a property."""
        property_instance = self.get_object()

        # Check if the user already reviewed this property
        existing_review = PropertyReview.objects.filter(
            property=property_instance, user=request.user
        ).first()
        if existing_review:
            return Response(
                {"detail": "You have already reviewed this property."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PropertyReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(property=property_instance, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def add_open_house(self, request, pk=None):
        """Add an open house event to a property."""
        property_instance = self.get_object()

        # Check if the user owns this property
        if property_instance.listed_by != request.user:
            return Response(
                {
                    "detail": "You do not have permission to add open house events to this property."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = OpenHouseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(property=property_instance, hosted_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def map_data(self, request):
        """Return property locations for map display."""
        queryset = self.filter_queryset(self.get_queryset())

        # Filter out properties without location data
        queryset = queryset.exclude(latitude__isnull=True).exclude(
            longitude__isnull=True
        )

        map_data = []
        for property_obj in queryset:
            map_data.append(
                {
                    "id": property_obj.id,
                    "title": property_obj.title,
                    "price": float(property_obj.price),
                    "latitude": property_obj.latitude,
                    "longitude": property_obj.longitude,
                    "address": property_obj.get_full_address(),
                    "property_type": property_obj.property_type.name,
                    "bedrooms": property_obj.bedrooms,
                    "bathrooms": float(property_obj.bathrooms),
                    "square_feet": property_obj.square_feet,
                    "listing_type": property_obj.listing_type,
                    "status": property_obj.status,
                    "primary_image": property_obj.images.filter(is_primary=True)
                    .first()
                    .image.url
                    if property_obj.images.filter(is_primary=True).exists()
                    else None,
                }
            )

        return Response(map_data)


class PropertyTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for property types."""

    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class FeatureViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for features."""

    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["name", "category"]
    filterset_fields = ["category"]
