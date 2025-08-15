"""
Views for favorites app.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Favorite, SavedSearch
from .serializers import FavoriteSerializer, SavedSearchSerializer
from properties.models import Property


class FavoriteViewSet(viewsets.ModelViewSet):
    """API endpoint for user favorites."""

    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return favorites for the current user."""
        # Handle anonymous users during schema generation
        if getattr(self, "swagger_fake_view", False):
            return Favorite.objects.none()
        return Favorite.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Add a property to favorites."""
        property_id = request.data.get("property")
        notes = request.data.get("notes", "")

        # Check if property exists
        property_instance = get_object_or_404(Property, id=property_id)

        # Check if already favorited
        favorite = Favorite.objects.filter(
            user=request.user, property=property_instance
        ).first()
        if favorite:
            # If already favorited, just return it
            serializer = self.get_serializer(favorite)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create new favorite
        favorite = Favorite(user=request.user, property=property_instance, notes=notes)
        favorite.save()

        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        detail=False, methods=["delete"], url_path="property/(?P<property_id>[^/.]+)"
    )
    def delete_by_property(self, request, property_id=None):
        """Remove a favorite by property ID."""
        try:
            property_instance = get_object_or_404(Property, id=property_id)
            favorite = Favorite.objects.filter(
                user=request.user, property=property_instance
            ).first()

            if not favorite:
                return Response(
                    {"detail": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND
                )

            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SavedSearchViewSet(viewsets.ModelViewSet):
    """API endpoint for saved searches."""

    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return saved searches for the current user."""
        # Handle anonymous users during schema generation
        if getattr(self, "swagger_fake_view", False):
            return SavedSearch.objects.none()
        return SavedSearch.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Save the current user when creating a saved search."""
        serializer.save(user=self.request.user)
