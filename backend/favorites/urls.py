"""
URL patterns for favorites app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet, SavedSearchViewSet

router = DefaultRouter()
router.register(r'properties', FavoriteViewSet, basename='favorite')
router.register(r'searches', SavedSearchViewSet, basename='saved-search')

urlpatterns = [
    path('', include(router.urls)),
]
