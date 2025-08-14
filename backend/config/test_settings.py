"""
Test settings for DreamDwelling.
"""

from .settings import *

# Use SQLite for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',
    }
}

# Disable geospatial features for tests that don't need them
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != 'django.contrib.gis']

# Use faster password hasher
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable celery tasks
CELERY_TASK_ALWAYS_EAGER = True

# Disable throttling
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {}
}
