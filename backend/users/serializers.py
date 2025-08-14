"""
User serializers for DreamDwelling.
"""

from rest_framework import serializers
from .models import User, UserAddress


class UserAddressSerializer(serializers.ModelSerializer):
    """Serializer for user addresses."""

    class Meta:
        model = UserAddress
        fields = [
            "id",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "zip_code",
            "country",
            "is_default",
        ]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users."""

    addresses = UserAddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "bio",
            "profile_picture",
            "email_notifications",
            "is_agent",
            "license_number",
            "brokerage",
            "addresses",
        ]
        read_only_fields = ["id", "email", "is_staff", "is_superuser"]
        ref_name = (
            "CustomUser"  # Unique name to avoid conflict with djoser's UserSerializer
        )


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
            "phone_number",
        ]

    def validate(self, attrs):
        """Validate password match."""
        if attrs["password"] != attrs.pop("confirm_password"):
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        """Create a new user."""
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
