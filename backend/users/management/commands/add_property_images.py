"""
Add sample property images to existing properties using placeholder services.
This will make the site look much more realistic and visually appealing.
"""

from django.core.management.base import BaseCommand
from properties.models import Property, PropertyImage
import random


class Command(BaseCommand):
    help = "Add placeholder images to properties for better visual appeal"

    def add_arguments(self, parser):
        parser.add_argument(
            "--images-per-property",
            type=int,
            default=5,
            help="Average number of images per property",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("📸 Adding property images..."))

        properties = Property.objects.all()
        images_per_property = options["images_per_property"]

        # Clear existing property images
        PropertyImage.objects.all().delete()

        total_images = 0

        for property_obj in properties:
            # Random number of images per property (3-8)
            num_images = random.randint(
                max(1, images_per_property - 2), images_per_property + 3
            )

            for i in range(num_images):
                # Different image sizes for variety
                sizes = ["800/600", "1200/800", "1024/768", "900/675"]
                size = random.choice(sizes)

                # Generate unique seed for consistent but varied images
                seed = f"property{property_obj.id}image{i}"

                # Generate placeholder image URL using seed for consistency
                # Using Lorem Picsum with seed parameter for reliable images
                image_url = f"https://picsum.photos/seed/{seed}/{size}"

                # Alternative: Unsplash placeholder (higher quality but limited)
                # image_url = f"https://source.unsplash.com/{size}/?{category},real-estate"

                # Create caption based on image order
                captions = [
                    "Main exterior view",
                    "Living room",
                    "Kitchen",
                    "Master bedroom",
                    "Bathroom",
                    "Backyard/Outdoor space",
                    "Additional room",
                    "Street view",
                ]

                caption = captions[i] if i < len(captions) else f"Property view {i + 1}"

                PropertyImage.objects.create(
                    property=property_obj,
                    image=image_url,  # Store URL in image field for now
                    caption=caption,
                    is_primary=(i == 0),  # First image is primary
                    order=i,
                )

                total_images += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Successfully added {total_images} images to {len(properties)} properties!"
            )
        )
