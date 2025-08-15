from django.core.management.base import BaseCommand
from properties.models import PropertyImage
import random


class Command(BaseCommand):
    help = "Update existing property images with working placeholder URLs"

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🔄 Updating property image URLs..."))

        # Get all property images
        images = PropertyImage.objects.all()
        updated_count = 0

        for image in images:
            # Different image sizes for variety
            sizes = ["800/600", "1200/800", "1024/768", "900/675"]
            size = random.choice(sizes)

            # Generate unique seed for consistent but varied images
            seed = f"property{image.property.id}image{image.order}"

            # Generate working placeholder image URL using seed
            new_url = f"https://picsum.photos/seed/{seed}/{size}"

            # Update the image URL
            image.image = new_url
            image.save()

            updated_count += 1

            if updated_count % 50 == 0:
                self.stdout.write(f"Updated {updated_count} images...")

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Successfully updated {updated_count} property image URLs!"
            )
        )
