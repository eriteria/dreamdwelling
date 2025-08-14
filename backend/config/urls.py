"""
URL configuration for DreamDwelling project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="DreamDwelling API",
        default_version="v1",
        description="API for DreamDwelling real estate platform",
        contact=openapi.Contact(email="support@dreamdwelling.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),
    # API Documentation
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # API endpoints
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    path("api/users/", include("users.urls")),
    path("api/properties/", include("properties.urls")),
    path("api/search/", include("search.urls")),
    path("api/favorites/", include("favorites.urls")),
    path("api/analytics/", include("analytics.urls")),
    path("api/neighborhoods/", include("neighborhoods.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
