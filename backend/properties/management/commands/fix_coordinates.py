"""
Management command to fix invalid property coordinates.
"""

import random
from django.core.management.base import BaseCommand
from django.db import models, transaction
from django.contrib.gis.geos import Point
from properties.models import Property


class Command(BaseCommand):
    help = "Fix invalid property coordinates with realistic US coordinates"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be changed without making changes",
        )
        parser.add_argument(
            "--zero-only",
            action="store_true",
            help="Only fix properties with coordinates at (0,0)",
        )
        parser.add_argument(
            "--include-us-invalid",
            action="store_true",
            help="Also fix properties with valid global coordinates but outside US range",
        )

    def handle(self, *args, **options):
        # Define realistic coordinate ranges for major US cities
        us_cities = [
            {
                "name": "New York, NY",
                "lat_range": (40.4774, 40.9176),
                "lng_range": (-74.2591, -73.7004),
            },
            {
                "name": "Los Angeles, CA",
                "lat_range": (33.7037, 34.3373),
                "lng_range": (-118.6681, -118.1553),
            },
            {
                "name": "Chicago, IL",
                "lat_range": (41.6445, 42.0230),
                "lng_range": (-87.9401, -87.5244),
            },
            {
                "name": "Houston, TX",
                "lat_range": (29.5274, 30.1103),
                "lng_range": (-95.8236, -95.0691),
            },
            {
                "name": "Phoenix, AZ",
                "lat_range": (33.2845, 33.7629),
                "lng_range": (-112.3735, -111.9314),
            },
            {
                "name": "Philadelphia, PA",
                "lat_range": (39.8673, 40.1379),
                "lng_range": (-75.2802, -74.9557),
            },
            {
                "name": "San Antonio, TX",
                "lat_range": (29.2133, 29.6498),
                "lng_range": (-98.8270, -98.2953),
            },
            {
                "name": "San Diego, CA",
                "lat_range": (32.5349, 32.9325),
                "lng_range": (-117.2713, -116.9325),
            },
            {
                "name": "Dallas, TX",
                "lat_range": (32.6178, 33.0237),
                "lng_range": (-96.9989, -96.5694),
            },
            {
                "name": "San Jose, CA",
                "lat_range": (37.1358, 37.4849),
                "lng_range": (-122.0579, -121.7195),
            },
        ]

        # Find properties with invalid coordinates based on command options
        if options["zero_only"]:
            # Only find properties with (0,0) coordinates
            invalid_properties = Property.objects.filter(
                models.Q(latitude=0) & models.Q(longitude=0)
            )
            self.stdout.write("Looking for properties with (0,0) coordinates only")
        else:
            # Get properties with invalid coordinates globally
            invalid_properties = Property.objects.filter(
                models.Q(latitude__isnull=False)
                & models.Q(longitude__isnull=False)
                & (
                    models.Q(latitude__lt=-90)
                    | models.Q(latitude__gt=90)
                    | models.Q(longitude__lt=-180)
                    | models.Q(longitude__gt=180)
                    | (
                        models.Q(latitude=0) & models.Q(longitude=0)
                    )  # 0,0 is in the Gulf of Guinea, unlikely for US properties
                )
            )

            # Optionally include properties outside US coordinates range
            if options["include_us_invalid"]:
                self.stdout.write("Including properties outside US coordinate range")
                # US latitude range: roughly 20°N to 50°N (excludes Alaska/Hawaii for simplicity)
                # US longitude range: roughly 130°W to 65°W (-130 to -65)
                us_invalid_properties = Property.objects.filter(
                    models.Q(latitude__isnull=False)
                    & models.Q(longitude__isnull=False)
                    & ~(
                        models.Q(latitude=0) & models.Q(longitude=0)
                    )  # Exclude already captured 0,0
                    & (
                        models.Q(latitude__lt=20)  # Too far south
                        | models.Q(latitude__gt=50)  # Too far north
                        | models.Q(longitude__lt=-130)  # Too far west
                        | models.Q(longitude__gt=-65)  # Too far east
                    )
                )
                invalid_properties = invalid_properties | us_invalid_properties

        self.stdout.write(
            f"Found {invalid_properties.count()} properties with invalid coordinates"
        )

        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("DRY RUN - No changes will be made"))

            # Show count of properties by issue type
            zero_count = invalid_properties.filter(latitude=0, longitude=0).count()
            out_of_bounds_count = invalid_properties.exclude(
                latitude=0, longitude=0
            ).count()

            self.stdout.write(f"Found {zero_count} properties with (0,0) coordinates")
            self.stdout.write(
                f"Found {out_of_bounds_count} properties with other invalid coordinates"
            )

            # Show preview of changes for first 10 properties
            self.stdout.write("\nPreview of changes for 10 sample properties:")
            for prop in invalid_properties[:10]:  # Show first 10
                city = random.choice(us_cities)
                new_lat = random.uniform(*city["lat_range"])
                new_lng = random.uniform(*city["lng_range"])
                self.stdout.write(
                    f"Property {prop.id}: {prop.title} ({prop.city}, {prop.state})"
                )
                self.stdout.write(
                    f"  Current: {prop.latitude}, {prop.longitude} -> New: {new_lat:.6f}, {new_lng:.6f} ({city['name']})"
                )

            if invalid_properties.count() > 10:
                self.stdout.write(
                    f"\n...and {invalid_properties.count() - 10} more properties"
                )

            return

        # Fix the coordinates
        updated_count = 0
        failed_count = 0

        # Use transaction to ensure all updates succeed or fail together
        with transaction.atomic():
            for prop in invalid_properties:
                try:
                    # Pick a random US city for realistic coordinates
                    city = random.choice(us_cities)

                    # Generate random coordinates within the city bounds
                    new_lat = random.uniform(*city["lat_range"])
                    new_lng = random.uniform(*city["lng_range"])

                    # Update the property's lat/lng fields
                    prop.latitude = new_lat
                    prop.longitude = new_lng

                    # Update the Point field to ensure GIS functionality works
                    prop.location = Point(
                        new_lng, new_lat
                    )  # Note: Point takes (x,y) which is (longitude,latitude)
                    prop.save()

                    updated_count += 1

                    if updated_count % 50 == 0:
                        self.stdout.write(f"Updated {updated_count} properties...")

                except Exception as e:
                    failed_count += 1
                    self.stdout.write(
                        self.style.ERROR(f"Error updating property {prop.id}: {str(e)}")
                    )

        if failed_count > 0:
            self.stdout.write(
                self.style.WARNING(
                    f"Updated {updated_count} properties with valid coordinates, but {failed_count} properties failed to update."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully updated all {updated_count} properties with valid coordinates"
                )
            )
