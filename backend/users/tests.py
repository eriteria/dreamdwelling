"""
Tests for user models.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import UserAddress

User = get_user_model()


class UserModelTests(TestCase):
    """Test cases for the User model."""
    
    def setUp(self):
        """Set up test data."""
        self.user_data = {
            'email': 'test@example.com',
            'password': 'TestPass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '555-123-4567',
        }
        
    def test_create_user(self):
        """Test creating a regular user."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.first_name, self.user_data['first_name'])
        self.assertEqual(user.last_name, self.user_data['last_name'])
        self.assertEqual(user.phone_number, self.user_data['phone_number'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        
    def test_create_superuser(self):
        """Test creating a superuser."""
        admin = User.objects.create_superuser(**self.user_data)
        self.assertEqual(admin.email, self.user_data['email'])
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_active)
        
    def test_user_str_method(self):
        """Test the string representation of a user."""
        user = User.objects.create_user(**self.user_data)
        expected = f"{user.first_name} {user.last_name} <{user.email}>"
        self.assertEqual(str(user), expected)
        
    def test_email_required(self):
        """Test that email is required."""
        data = self.user_data.copy()
        data.pop('email')
        with self.assertRaises(ValueError):
            User.objects.create_user(**data)


class UserAddressTests(TestCase):
    """Test cases for the UserAddress model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='TestPass123',
            first_name='Test',
            last_name='User',
        )
        
        self.address_data = {
            'user': self.user,
            'address_line1': '123 Main St',
            'city': 'Anytown',
            'state': 'NY',
            'zip_code': '12345',
            'country': 'United States',
        }
        
    def test_create_address(self):
        """Test creating a user address."""
        address = UserAddress.objects.create(**self.address_data)
        self.assertEqual(address.address_line1, self.address_data['address_line1'])
        self.assertEqual(address.city, self.address_data['city'])
        self.assertEqual(address.state, self.address_data['state'])
        self.assertEqual(address.zip_code, self.address_data['zip_code'])
        self.assertEqual(address.country, self.address_data['country'])
        self.assertFalse(address.is_default)
        
    def test_address_str_method(self):
        """Test the string representation of an address."""
        address = UserAddress.objects.create(**self.address_data)
        expected = f"{address.address_line1}, {address.city}, {address.state}"
        self.assertEqual(str(address), expected)
        
    def test_default_address(self):
        """Test setting a default address."""
        # Create a non-default address
        address1 = UserAddress.objects.create(**self.address_data)
        
        # Create a default address
        address2 = UserAddress.objects.create(
            user=self.user,
            address_line1='456 Oak Ave',
            city='Othertown',
            state='CA',
            zip_code='67890',
            country='United States',
            is_default=True
        )
        
        self.assertFalse(address1.is_default)
        self.assertTrue(address2.is_default)
