"""
Management command to convert lat/lng to GIS Point fields.
"""

from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from neighborhoods.models import School, PointOfInterest
from properties.models import Property


class Command(BaseCommand):
    help = "Convert latitude/longitude fields to GIS Point fields"

    def handle(self, *args, **options):
        # Process School objects
        schools = School.objects.filter(latitude__isnull=False, longitude__isnull=False)
        school_count = 0

        for school in schools:
            try:
                school.location = Point(school.longitude, school.latitude, srid=4326)
                school.save(update_fields=["location"])
                school_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing School {school.id}: {e}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully updated location for {school_count} schools"
            )
        )

        # Process PointOfInterest objects
        pois = PointOfInterest.objects.filter(
            latitude__isnull=False, longitude__isnull=False
        )
        poi_count = 0

        for poi in pois:
            try:
                poi.location = Point(poi.longitude, poi.latitude, srid=4326)
                poi.save(update_fields=["location"])
                poi_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing PointOfInterest {poi.id}: {e}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully updated location for {poi_count} points of interest"
            )
        )

        # Process Property objects
        properties = Property.objects.filter(
            latitude__isnull=False, longitude__isnull=False
        )
        property_count = 0

        for prop in properties:
            try:
                # Check if location already exists
                if not prop.location:
                    prop.location = Point(prop.longitude, prop.latitude, srid=4326)
                    prop.save(update_fields=["location"])
                    property_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing Property {prop.id}: {e}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully updated location for {property_count} properties"
            )
        )
