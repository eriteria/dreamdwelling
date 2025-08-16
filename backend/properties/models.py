"""
Models for property listings in DreamDwelling.
"""

from django.db import models
from django.contrib.gis.db import models as gis_models
from users.models import User


class PropertyType(models.Model):
    """Property type model, e.g., Single Family Home, Condo, etc."""

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Property Types"


class Feature(models.Model):
    """Features that properties can have, e.g., Swimming Pool, Fireplace."""

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)  # e.g., Indoor, Outdoor, Security
    icon = models.CharField(
        max_length=50, blank=True
    )  # FontAwesome or similar icon name

    def __str__(self):
        return self.name


class Property(models.Model):
    """Main property listing model."""

    STATUS_CHOICES = [
        ("available", "Available"),
        ("pending", "Pending"),
        ("sold", "Sold"),
        ("off_market", "Off Market"),
    ]

    LISTING_TYPE_CHOICES = [
        ("sale", "For Sale"),
        ("rent", "For Rent"),
        ("both", "For Sale & Rent"),
    ]

    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="available"
    )
    listing_type = models.CharField(
        max_length=10, choices=LISTING_TYPE_CHOICES, default="sale"
    )

    # Location
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="United States")
    # Restored GIS PointField for spatial functionality
    location = gis_models.PointField(null=True, blank=True)
    # Keep these fields for compatibility with existing data
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Pricing
    price = models.DecimalField(max_digits=12, decimal_places=2)
    price_per_sqft = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True
    )
    monthly_rent = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    hoa_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

    # Property Details
    bedrooms = models.PositiveSmallIntegerField()
    bathrooms = models.DecimalField(max_digits=4, decimal_places=1)
    half_bathrooms = models.PositiveSmallIntegerField(default=0)
    square_feet = models.PositiveIntegerField()
    lot_size = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    year_built = models.PositiveIntegerField(blank=True, null=True)
    parking_spaces = models.PositiveSmallIntegerField(default=0)

    # Features
    features = models.ManyToManyField(Feature, related_name="properties", blank=True)
    has_air_conditioning = models.BooleanField(default=False)
    has_heating = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    furnished = models.BooleanField(default=False)

    # Listing Information
    listed_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="listed_properties"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    views_count = models.PositiveIntegerField(default=0)
    favorites_count = models.PositiveIntegerField(default=0)

    # Virtual Tour
    virtual_tour_url = models.URLField(blank=True)

    # History
    # Replaced ArrayField with JSONField for SQLite compatibility
    price_history = models.JSONField(default=list, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.address_line1}, {self.city}"

    def save(self, *args, **kwargs):
        """Override save to sync location fields."""
        from django.contrib.gis.geos import Point

        # Sync PointField with lat/lng fields
        if self.latitude is not None and self.longitude is not None:
            self.location = Point(self.longitude, self.latitude)
        elif self.location:
            # If location is set but lat/lng are not, extract them
            self.longitude = self.location.x
            self.latitude = self.location.y

        super().save(*args, **kwargs)

    def get_full_address(self):
        """Return the full formatted address."""
        address_parts = [self.address_line1]
        if self.address_line2:
            address_parts.append(self.address_line2)
        address_parts.extend([self.city, self.state, self.zip_code])
        return ", ".join(address_parts)


class PropertyImage(models.Model):
    """Images for property listings."""

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")
    caption = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image for {self.property.title}"


class PropertyDocument(models.Model):
    """Documents for property listings (floor plans, permits, etc.)."""

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="documents"
    )
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="property_documents/")
    document_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.document_type} - {self.title}"


class PropertyReview(models.Model):
    """Reviews for properties."""

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="property_reviews"
    )
    rating = models.PositiveSmallIntegerField()  # 1-5 stars
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("property", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.rating} stars"


class OpenHouse(models.Model):
    """Open house events for properties."""

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="open_houses"
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True)
    hosted_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="hosted_open_houses"
    )

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return f"Open House at {self.property.address_line1} on {self.start_time.strftime('%Y-%m-%d')}"
