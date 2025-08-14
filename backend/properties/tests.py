"""
Tests for property models.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from properties.models import Property, PropertyType, Feature, PropertyImage

User = get_user_model()


class PropertyModelTests(TestCase):
    """Test cases for the Property model."""
    
    def setUp(self):
        """Set up test data."""
        # Create a user
        self.user = User.objects.create_user(
            email='agent@example.com',
            password='AgentPass123',
            first_name='Agent',
            last_name='Smith',
            is_agent=True
        )
        
        # Create a property type
        self.property_type = PropertyType.objects.create(
            name='Single Family Home',
            description='A standalone house for a single family'
        )
        
        # Create features
        self.feature_pool = Feature.objects.create(
            name='Swimming Pool',
            category='Outdoor',
            icon='pool'
        )
        
        self.feature_fireplace = Feature.objects.create(
            name='Fireplace',
            category='Indoor',
            icon='fire'
        )
        
        # Property data
        self.property_data = {
            'title': 'Beautiful 3BR Home with Pool',
            'description': 'A stunning family home in a great neighborhood.',
            'property_type': self.property_type,
            'status': 'available',
            'listing_type': 'sale',
            'address_line1': '123 Main St',
            'city': 'Anytown',
            'state': 'NY',
            'zip_code': '12345',
            'country': 'United States',
            'location': Point(-73.9857, 40.7484),  # Example coordinates
            'price': 450000,
            'bedrooms': 3,
            'bathrooms': 2.5,
            'square_feet': 2200,
            'lot_size': 0.25,
            'year_built': 2005,
            'parking_spaces': 2,
            'has_air_conditioning': True,
            'has_heating': True,
            'listed_by': self.user,
        }
        
    def test_create_property(self):
        """Test creating a property listing."""
        property_listing = Property.objects.create(**self.property_data)
        
        self.assertEqual(property_listing.title, self.property_data['title'])
        self.assertEqual(property_listing.bedrooms, self.property_data['bedrooms'])
        self.assertEqual(property_listing.bathrooms, self.property_data['bathrooms'])
        self.assertEqual(property_listing.square_feet, self.property_data['square_feet'])
        self.assertEqual(property_listing.price, self.property_data['price'])
        self.assertEqual(property_listing.listed_by, self.user)
        self.assertEqual(property_listing.views_count, 0)
        self.assertEqual(property_listing.favorites_count, 0)
        
    def test_property_str_method(self):
        """Test the string representation of a property."""
        property_listing = Property.objects.create(**self.property_data)
        expected = f"{property_listing.title} - {property_listing.address_line1}, {property_listing.city}"
        self.assertEqual(str(property_listing), expected)
        
    def test_property_features(self):
        """Test adding features to a property."""
        property_listing = Property.objects.create(**self.property_data)
        
        # Add features
        property_listing.features.add(self.feature_pool, self.feature_fireplace)
        
        self.assertEqual(property_listing.features.count(), 2)
        self.assertIn(self.feature_pool, property_listing.features.all())
        self.assertIn(self.feature_fireplace, property_listing.features.all())
        
    def test_property_images(self):
        """Test adding images to a property."""
        property_listing = Property.objects.create(**self.property_data)
        
        # Create a primary image
        primary_image = PropertyImage.objects.create(
            property=property_listing,
            image='property_images/test1.jpg',
            caption='Front view',
            is_primary=True
        )
        
        # Create a secondary image
        secondary_image = PropertyImage.objects.create(
            property=property_listing,
            image='property_images/test2.jpg',
            caption='Backyard',
            is_primary=False,
            order=1
        )
        
        self.assertEqual(property_listing.images.count(), 2)
        
        # Test that we can retrieve images in the correct order
        images = property_listing.images.all().order_by('order', 'id')
        self.assertEqual(images[0], primary_image)
        self.assertEqual(images[1], secondary_image)
