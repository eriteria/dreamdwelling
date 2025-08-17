"""
Management command to check if properties have valid coordinates.
"""

from django.core.management.base import BaseCommand
from properties.models import Property


class Command(BaseCommand):
    """
    Checks if properties have valid coordinates.
    """

    help = "Checks if properties have valid coordinates"

    def handle(self, *args, **options):
        """
        Run the command.
        """
        try:
            # Get all properties
            properties = Property.objects.all()
            total_count = properties.count()

            self.stdout.write(f"Total properties: {total_count}")

            # Count properties with valid coordinates
            valid_count = properties.filter(
                latitude__isnull=False, longitude__isnull=False
            ).count()

            self.stdout.write(
                f"Properties with valid coordinates: {valid_count} ({valid_count / total_count * 100:.2f}%)"
            )

            # Check for properties with (0, 0) coordinates
            zero_coords = properties.filter(latitude=0, longitude=0).count()

            if zero_coords > 0:
                self.stdout.write(
                    self.style.WARNING(
                        f"Properties with (0, 0) coordinates: {zero_coords}"
                    )
                )
            else:
                self.stdout.write("No properties with (0, 0) coordinates.")

            # Sample some properties to inspect their coordinates
            sample = properties.filter(latitude__isnull=False, longitude__isnull=False)[
                :5
            ]

            self.stdout.write("\nSample properties:")
            for prop in sample:
                self.stdout.write(
                    f"ID: {prop.id}, Title: {prop.title}, Coordinates: ({prop.latitude}, {prop.longitude})"
                )

            # Check for properties with invalid coordinates (outside reasonable bounds)
            # Assuming we're dealing with properties in the United States
            invalid_us_coords = (
                properties.filter(latitude__isnull=False, longitude__isnull=False)
                .exclude(
                    latitude__range=(24, 50),  # Approximate US latitude range
                    longitude__range=(-125, -66),  # Approximate US longitude range
                )
                .count()
            )

            if invalid_us_coords > 0:
                self.stdout.write(
                    self.style.WARNING(
                        f"Properties with coordinates outside the continental US range: {invalid_us_coords}"
                    )
                )
            else:
                self.stdout.write(
                    "All properties with coordinates are within the continental US range."
                )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
            import traceback

            self.stdout.write(traceback.format_exc())
