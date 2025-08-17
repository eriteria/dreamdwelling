"""
Management command to verify all property coordinates in the database.
"""

from django.core.management.base import BaseCommand
from django.db import models
from properties.models import Property


class Command(BaseCommand):
    help = "Verify that all property coordinates in the database are valid"

    def add_arguments(self, parser):
        parser.add_argument(
            "--fix",
            action="store_true",
            help="Attempt to fix invalid coordinates (uses fix_coordinates command)",
        )

    def handle(self, *args, **options):
        # Define valid coordinate ranges
        GLOBAL_MIN_LAT = -90
        GLOBAL_MAX_LAT = 90
        GLOBAL_MIN_LNG = -180
        GLOBAL_MAX_LNG = 180

        # Define US coordinate ranges (approximate)
        US_MIN_LAT = 20  # Excludes Hawaii
        US_MAX_LAT = 50  # Excludes Alaska
        US_MIN_LNG = -130
        US_MAX_LNG = -65

        # Count properties
        total_properties = Property.objects.count()
        properties_with_coords = Property.objects.filter(
            latitude__isnull=False, longitude__isnull=False
        ).count()

        # Find properties with missing coordinates
        missing_coords = Property.objects.filter(
            models.Q(latitude__isnull=True) | models.Q(longitude__isnull=True)
        )

        # Find properties with globally invalid coordinates
        invalid_global = Property.objects.filter(
            latitude__isnull=False, longitude__isnull=False
        ).filter(
            models.Q(latitude__lt=GLOBAL_MIN_LAT)
            | models.Q(latitude__gt=GLOBAL_MAX_LAT)
            | models.Q(longitude__lt=GLOBAL_MIN_LNG)
            | models.Q(longitude__gt=GLOBAL_MAX_LNG)
        )

        # Find properties with zero coordinates (0,0) - unlikely for real properties
        zero_coords = Property.objects.filter(latitude=0, longitude=0)

        # Find properties outside the continental US
        outside_us = (
            Property.objects.filter(latitude__isnull=False, longitude__isnull=False)
            .filter(
                models.Q(latitude__lt=US_MIN_LAT)
                | models.Q(latitude__gt=US_MAX_LAT)
                | models.Q(longitude__lt=US_MIN_LNG)
                | models.Q(longitude__gt=US_MAX_LNG)
            )
            .exclude(
                models.Q(latitude__lt=GLOBAL_MIN_LAT)
                | models.Q(latitude__gt=GLOBAL_MAX_LAT)
                | models.Q(longitude__lt=GLOBAL_MIN_LNG)
                | models.Q(longitude__gt=GLOBAL_MAX_LNG)
                | models.Q(latitude=0, longitude=0)
            )
        )

        # Find properties with point field inconsistent with lat/lng
        inconsistent_point = []
        for prop in Property.objects.filter(
            latitude__isnull=False, longitude__isnull=False, location__isnull=False
        ):
            # Point stores coords as (longitude, latitude) = (x, y)
            if (
                abs(prop.location.x - prop.longitude) > 0.0001
                or abs(prop.location.y - prop.latitude) > 0.0001
            ):
                inconsistent_point.append(prop)

        # Print summary
        self.stdout.write("===== PROPERTY COORDINATES VERIFICATION REPORT =====")
        self.stdout.write(f"Total properties: {total_properties}")
        self.stdout.write(
            f"Properties with coordinates: {properties_with_coords} ({properties_with_coords / total_properties * 100:.1f}%)"
        )
        self.stdout.write(f"Properties missing coordinates: {missing_coords.count()}")

        self.stdout.write("\n===== COORDINATE VALIDITY =====")
        if invalid_global.count() == 0:
            self.stdout.write(
                self.style.SUCCESS("✓ No properties with globally invalid coordinates")
            )
        else:
            self.stdout.write(
                self.style.ERROR(
                    f"✗ {invalid_global.count()} properties with globally invalid coordinates"
                )
            )

        if zero_coords.count() == 0:
            self.stdout.write(
                self.style.SUCCESS("✓ No properties with (0,0) coordinates")
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"? {zero_coords.count()} properties with (0,0) coordinates"
                )
            )

        if outside_us.count() == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    "✓ All properties with coordinates are within the continental US"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"? {outside_us.count()} properties with coordinates outside the continental US"
                )
            )

        if len(inconsistent_point) == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    "✓ All Point fields are consistent with lat/lng values"
                )
            )
        else:
            self.stdout.write(
                self.style.ERROR(
                    f"✗ {len(inconsistent_point)} properties have inconsistent Point and lat/lng values"
                )
            )

        # Show examples of invalid coordinates if any
        if invalid_global.count() > 0:
            self.stdout.write("\n===== EXAMPLES OF GLOBALLY INVALID COORDINATES =====")
            for prop in invalid_global[:5]:
                self.stdout.write(
                    f"{prop.id}: {prop.title} - ({prop.latitude}, {prop.longitude})"
                )
            if invalid_global.count() > 5:
                self.stdout.write(f"...and {invalid_global.count() - 5} more")

        if zero_coords.count() > 0:
            self.stdout.write(
                "\n===== EXAMPLES OF PROPERTIES WITH (0,0) COORDINATES ====="
            )
            for prop in zero_coords[:5]:
                self.stdout.write(
                    f"{prop.id}: {prop.title} - ({prop.latitude}, {prop.longitude})"
                )
            if zero_coords.count() > 5:
                self.stdout.write(f"...and {zero_coords.count() - 5} more")

        if outside_us.count() > 0:
            self.stdout.write(
                "\n===== EXAMPLES OF PROPERTIES OUTSIDE CONTINENTAL US ====="
            )
            for prop in outside_us[:5]:
                self.stdout.write(
                    f"{prop.id}: {prop.title} - ({prop.latitude}, {prop.longitude})"
                )
            if outside_us.count() > 5:
                self.stdout.write(f"...and {outside_us.count() - 5} more")

        if len(inconsistent_point) > 0:
            self.stdout.write("\n===== EXAMPLES OF INCONSISTENT POINT FIELDS =====")
            for prop in inconsistent_point[:5]:
                self.stdout.write(f"{prop.id}: {prop.title}")
                self.stdout.write(f"  lat/lng: ({prop.latitude}, {prop.longitude})")
                self.stdout.write(f"  point: ({prop.location.y}, {prop.location.x})")
            if len(inconsistent_point) > 5:
                self.stdout.write(f"...and {len(inconsistent_point) - 5} more")

        # Fix if requested
        if options["fix"] and (
            invalid_global.count() > 0
            or zero_coords.count() > 0
            or len(inconsistent_point) > 0
        ):
            self.stdout.write("\n===== FIXING INVALID COORDINATES =====")
            from django.core.management import call_command

            # Fix invalid global coordinates and zero coordinates
            if invalid_global.count() > 0 or zero_coords.count() > 0:
                self.stdout.write("Running fix_coordinates command...")
                call_command("fix_coordinates")

            # Fix inconsistent points
            if len(inconsistent_point) > 0:
                from django.contrib.gis.geos import Point

                self.stdout.write("Fixing inconsistent Point fields...")
                fixed_count = 0
                for prop in inconsistent_point:
                    prop.location = Point(prop.longitude, prop.latitude)
                    prop.save()
                    fixed_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Fixed {fixed_count} inconsistent Point fields")
                )

        elif options["fix"]:
            self.stdout.write(self.style.SUCCESS("No invalid coordinates to fix!"))
