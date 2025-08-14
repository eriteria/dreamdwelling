"""
Custom user models for DreamDwelling.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email authentication."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        # If username is not provided, use email as username
        if "username" not in extra_fields:
            extra_fields["username"] = email

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom user model that uses email as the unique identifier."""

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    email = models.EmailField(_("email address"), unique=True)
    phone_number = models.CharField(_("phone number"), max_length=15, blank=True)
    bio = models.TextField(_("bio"), blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )

    # User preferences
    email_notifications = models.BooleanField(default=True)

    # For agents/brokers
    is_agent = models.BooleanField(default=False)
    license_number = models.CharField(max_length=50, blank=True)
    brokerage = models.CharField(max_length=100, blank=True)

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"


class UserAddress(models.Model):
    """User address model for shipping or other purposes."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="United States")
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.address_line1}, {self.city}, {self.state}"
