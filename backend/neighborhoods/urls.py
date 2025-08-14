"""
URL patterns for neighborhoods app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NeighborhoodViewSet, SchoolViewSet, PointOfInterestViewSet

router = DefaultRouter()
router.register(r'', NeighborhoodViewSet, basename='neighborhood')
router.register(r'schools', SchoolViewSet, basename='school')
router.register(r'poi', PointOfInterestViewSet, basename='poi')

urlpatterns = [
    path('', include(router.urls)),
]
