"""
User views for DreamDwelling.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User, UserAddress
from .serializers import UserSerializer, UserAddressSerializer


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return the current user or users list for admins."""
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update the current user profile."""
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def add_address(self, request):
        """Add a new address to the current user profile."""
        # Set default address if this is the first one or explicitly requested
        is_default = request.data.get('is_default', False)
        if is_default:
            # If setting this as default, unset any existing defaults
            UserAddress.objects.filter(user=request.user, is_default=True).update(is_default=False)
        elif UserAddress.objects.filter(user=request.user).count() == 0:
            # If this is the first address, make it default
            is_default = True
        
        # Create new address
        serializer = UserAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, is_default=is_default)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'])
    def update_address(self, request):
        """Update an existing address."""
        address_id = request.data.get('id')
        if not address_id:
            return Response({"error": "Address ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        address = get_object_or_404(UserAddress, id=address_id, user=request.user)
        
        # Handle default address change
        is_default = request.data.get('is_default', False)
        if is_default and not address.is_default:
            # If setting this as default, unset any existing defaults
            UserAddress.objects.filter(user=request.user, is_default=True).update(is_default=False)
        
        serializer = UserAddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(is_default=is_default)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def delete_address(self, request):
        """Delete an address."""
        address_id = request.query_params.get('id')
        if not address_id:
            return Response({"error": "Address ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        address = get_object_or_404(UserAddress, id=address_id, user=request.user)
        was_default = address.is_default
        address.delete()
        
        # If deleted address was the default, set another address as default if any exist
        if was_default:
            remaining_address = UserAddress.objects.filter(user=request.user).first()
            if remaining_address:
                remaining_address.is_default = True
                remaining_address.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
