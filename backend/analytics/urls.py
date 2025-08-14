"""
URL patterns for analytics app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MarketTrendViewSet, PropertyValuationViewSet

router = DefaultRouter()
router.register(r'trends', MarketTrendViewSet, basename='market-trend')
router.register(r'valuations', PropertyValuationViewSet, basename='property-valuation')

urlpatterns = [
    path('', include(router.urls)),
]
