"""
Management command to fix invalid property coordinates.
"""

from django.core.management.base import BaseCommand
from django.db import models
from properties.models import Property
from django.contrib.gis.geos import Point
import random


class Command(BaseCommand):
    help = "Fix invalid property coordinates"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be fixed without making changes",
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
                "lat_range": (29.5230, 30.1105),
                "lng_range": (-95.8236, -95.0746),
            },
            {
                "name": "Phoenix, AZ",
                "lat_range": (33.2406, 33.8187),
                "lng_range": (-112.3239, -111.9289),
            },
            {
                "name": "Philadelphia, PA",
                "lat_range": (39.8670, 40.1379),
                "lng_range": (-75.2803, -74.9558),
            },
            {
                "name": "San Antonio, TX",
                "lat_range": (29.2154, 29.6999),
                "lng_range": (-98.7951, -98.2944),
            },
            {
                "name": "San Diego, CA",
                "lat_range": (32.5344, 33.1148),
                "lng_range": (-117.2841, -116.9318),
            },
            {
                "name": "Dallas, TX",
                "lat_range": (32.6174, 32.9667),
                "lng_range": (-96.9991, -96.5991),
            },
            {
                "name": "Austin, TX",
                "lat_range": (30.0986, 30.5162),
                "lng_range": (-97.9383, -97.5689),
            },
        ]

        # Get properties with coordinates that are invalid for US
        # US latitude range: roughly 20°N to 50°N (excludes Alaska/Hawaii for simplicity)
        # US longitude range: roughly 130°W to 65°W (-130 to -65)
        invalid_properties = Property.objects.filter(
            models.Q(latitude__isnull=False)
            & models.Q(longitude__isnull=False)
            & (
                models.Q(latitude__lt=20)  # Too far south
                | models.Q(latitude__gt=50)  # Too far north
                | models.Q(longitude__lt=-130)  # Too far west
                | models.Q(longitude__gt=-65)  # Too far east
                | models.Q(latitude__lt=-90)  # Invalid globally
                | models.Q(latitude__gt=90)  # Invalid globally
                | models.Q(longitude__lt=-180)  # Invalid globally
                | models.Q(longitude__gt=180)  # Invalid globally
            )
        )

        self.stdout.write(
            f"Found {invalid_properties.count()} properties with invalid US coordinates"
        )

        if options["dry_run"]:
            self.stdout.write("DRY RUN - No changes will be made")
            for prop in invalid_properties[:10]:  # Show first 10
                city = random.choice(us_cities)
                new_lat = random.uniform(*city["lat_range"])
                new_lng = random.uniform(*city["lng_range"])
                self.stdout.write(
                    f"Property {prop.id}: {prop.latitude}, {prop.longitude} -> {new_lat:.6f}, {new_lng:.6f} ({city['name']})"
                )
            return

        # Fix the coordinates
        fixed_count = 0
        for prop in invalid_properties:
            city = random.choice(us_cities)

            # Generate random coordinates within the city bounds
            new_lat = random.uniform(*city["lat_range"])
            new_lng = random.uniform(*city["lng_range"])

            # Update the property
            prop.latitude = new_lat
            prop.longitude = new_lng
            prop.location = Point(new_lng, new_lat)  # Point(longitude, latitude)
            prop.save()

            fixed_count += 1
            self.stdout.write(
                f"Fixed Property {prop.id}: {city['name']} -> {new_lat:.6f}, {new_lng:.6f}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully updated {fixed_count} properties with valid US coordinates"
            )
        )
