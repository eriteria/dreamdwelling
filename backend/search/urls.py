"""
URL patterns for search app.
"""

from django.urls import path
from .views import PropertiesSearchView, AutocompleteSearchView

urlpatterns = [
    path('properties/', PropertiesSearchView.as_view(), name='property-search'),
    path('autocomplete/', AutocompleteSearchView.as_view(), name='location-autocomplete'),
]
