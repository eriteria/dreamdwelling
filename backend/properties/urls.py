"""
URL patterns for properties app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, PropertyTypeViewSet, FeatureViewSet

router = DefaultRouter()
router.register(r'', PropertyViewSet, basename='property')
router.register(r'types', PropertyTypeViewSet, basename='property-type')
router.register(r'features', FeatureViewSet, basename='feature')

urlpatterns = [
    path('', include(router.urls)),
]
