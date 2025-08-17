"""
Management command to check GeoDjango installation and configuration.
"""

from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from django.contrib.gis.gdal import OGRGeometry
import os


class Command(BaseCommand):
    """
    Checks if GeoDjango is properly installed and configured.
    """

    help = "Checks GeoDjango installation and configuration"

    def handle(self, *args, **options):
        """
        Run the command.
        """
        try:
            self.stdout.write(self.style.SUCCESS("Checking GDAL and GEOS libraries..."))

            # Check environment variables
            gdal_data = os.environ.get("GDAL_DATA", "Not set")
            proj_lib = os.environ.get("PROJ_LIB", "Not set")

            self.stdout.write(f"GDAL_DATA: {gdal_data}")
            self.stdout.write(f"PROJ_LIB: {proj_lib}")

            # Try creating a point
            self.stdout.write("Creating a Point object...")
            point = Point(0, 0)
            self.stdout.write(f"Point created: {point}")

            # Try creating an OGRGeometry
            self.stdout.write("Creating an OGRGeometry object...")
            wkt = "POINT (0 0)"
            ogr_point = OGRGeometry(wkt)
            self.stdout.write(f"OGRGeometry created: {ogr_point}")

            # Success!
            self.stdout.write(self.style.SUCCESS("GeoDjango is properly configured!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
            self.stdout.write(self.style.ERROR("GeoDjango is not properly configured."))
            import traceback

            self.stdout.write(traceback.format_exc())
