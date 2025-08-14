"""
Models for market analytics and trends.
"""

from django.db import models
from django.contrib.postgres.fields import ArrayField


class MarketTrend(models.Model):
    """Model for real estate market trends."""
    
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20, blank=True)
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    date = models.DateField()
    
    # Price metrics
    median_price = models.DecimalField(max_digits=12, decimal_places=2)
    avg_price = models.DecimalField(max_digits=12, decimal_places=2)
    price_per_sqft = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Volume metrics
    total_listings = models.PositiveIntegerField()
    new_listings = models.PositiveIntegerField()
    pending_sales = models.PositiveIntegerField()
    closed_sales = models.PositiveIntegerField()
    
    # Market health
    days_on_market = models.PositiveIntegerField()  # Average days on market
    months_of_inventory = models.DecimalField(max_digits=5, decimal_places=2)
    price_drops_pct = models.DecimalField(max_digits=5, decimal_places=2)  # % of listings with price drops
    
    class Meta:
        unique_together = ['city', 'state', 'zip_code', 'period', 'date']
        ordering = ['-date']
        
    def __str__(self):
        location = f"{self.city}, {self.state}"
        if self.zip_code:
            location += f" {self.zip_code}"
        return f"{location} - {self.period} trend for {self.date}"


class PropertyValuation(models.Model):
    """Model for property valuation estimates."""
    
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    
    # Property details (for estimation)
    bedrooms = models.PositiveSmallIntegerField()
    bathrooms = models.DecimalField(max_digits=4, decimal_places=1)
    square_feet = models.PositiveIntegerField()
    lot_size = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    year_built = models.PositiveIntegerField()
    
    # Valuation data
    estimated_value = models.DecimalField(max_digits=12, decimal_places=2)
    estimated_rent = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    confidence_score = models.PositiveSmallIntegerField()  # 0-100 confidence level
    last_updated = models.DateTimeField(auto_now=True)
    
    # Historical valuations (stored as JSON array)
    valuation_history = ArrayField(
        models.JSONField(),
        default=list,
        blank=True
    )
    
    class Meta:
        unique_together = ['address_line1', 'city', 'state', 'zip_code']
        
    def __str__(self):
        return f"{self.address_line1}, {self.city}, {self.state} - ${self.estimated_value:,.2f}"
