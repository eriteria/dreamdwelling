"""
Models for user favorites and saved searches.
"""

from django.db import models
from django.contrib.postgres.fields import JSONField
from users.models import User
from properties.models import Property


class Favorite(models.Model):
    """Model for users to save favorite properties."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('user', 'property')
        
    def __str__(self):
        return f"{self.user.email} - {self.property.title}"

    def save(self, *args, **kwargs):
        """Update favorites count on property when saving favorite."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            self.property.favorites_count += 1
            self.property.save(update_fields=['favorites_count'])

    def delete(self, *args, **kwargs):
        """Update favorites count on property when removing favorite."""
        self.property.favorites_count = max(0, self.property.favorites_count - 1)
        self.property.save(update_fields=['favorites_count'])
        super().delete(*args, **kwargs)


class SavedSearch(models.Model):
    """Model for saved search parameters."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_searches')
    name = models.CharField(max_length=255)
    search_params = models.JSONField()  # Store search parameters as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    last_run = models.DateTimeField(auto_now=True)
    
    # Email notification settings
    notify_new_listings = models.BooleanField(default=False)
    notify_price_changes = models.BooleanField(default=False)
    notify_status_changes = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} ({self.user.email})"
