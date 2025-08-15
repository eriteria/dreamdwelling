"""
Display statistics about the generated dummy data.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import models
from properties.models import (
    Property,
    PropertyType,
    Feature,
    PropertyReview,
    OpenHouse,
    PropertyImage,
)
from neighborhoods.models import Neighborhood
from favorites.models import Favorite

User = get_user_model()


class Command(BaseCommand):
    help = "Display statistics about the dummy data in the system"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS("📊 DreamDwelling Data Statistics\n" + "=" * 50)
        )

        # User statistics
        total_users = User.objects.count()
        agents = User.objects.filter(is_agent=True).count()
        clients = total_users - agents

        self.stdout.write(f"👥 Users: {total_users} total")
        self.stdout.write(f"   🏢 Agents: {agents}")
        self.stdout.write(f"   👤 Clients: {clients}\n")

        # Property statistics
        total_properties = Property.objects.count()
        available_properties = Property.objects.filter(status="available").count()
        pending_properties = Property.objects.filter(status="pending").count()
        sold_properties = Property.objects.filter(status="sold").count()

        self.stdout.write(f"🏠 Properties: {total_properties} total")
        self.stdout.write(f"   ✅ Available: {available_properties}")
        self.stdout.write(f"   ⏳ Pending: {pending_properties}")
        self.stdout.write(f"   ✔️ Sold: {sold_properties}\n")

        # Property type breakdown
        self.stdout.write("🏘️  Property Types:")
        for prop_type in PropertyType.objects.all():
            count = Property.objects.filter(property_type=prop_type).count()
            self.stdout.write(f"   {prop_type.name}: {count}")

        # Price statistics
        if total_properties > 0:
            price_stats = Property.objects.aggregate(
                avg_price=models.Avg("price"),
                min_price=models.Min("price"),
                max_price=models.Max("price"),
            )

            self.stdout.write("\n💰 Price Range:")
            self.stdout.write(
                f"   Min: ${price_stats['min_price']:,.2f}"
                if price_stats["min_price"]
                else "   Min: N/A"
            )
            self.stdout.write(
                f"   Max: ${price_stats['max_price']:,.2f}"
                if price_stats["max_price"]
                else "   Max: N/A"
            )
            self.stdout.write(
                f"   Avg: ${price_stats['avg_price']:,.2f}"
                if price_stats["avg_price"]
                else "   Avg: N/A"
            )

        # Neighborhood statistics
        neighborhoods = Neighborhood.objects.count()
        self.stdout.write(f"\n🏘️  Neighborhoods: {neighborhoods}")

        # Features
        features = Feature.objects.count()
        self.stdout.write(f"✨ Features: {features}")

        # Images
        images = PropertyImage.objects.count()
        avg_images = images / total_properties if total_properties > 0 else 0
        self.stdout.write(f"📸 Images: {images} total ({avg_images:.1f} per property)")

        # Reviews
        reviews = PropertyReview.objects.count()
        self.stdout.write(f"⭐ Reviews: {reviews}")

        # Open houses
        open_houses = OpenHouse.objects.count()
        self.stdout.write(f"🏡 Open Houses: {open_houses}")

        # Favorites
        favorites = Favorite.objects.count()
        self.stdout.write(f"❤️ Favorites: {favorites}")

        self.stdout.write(
            self.style.SUCCESS(
                "\n🎉 Your DreamDwelling site now has comprehensive dummy data!"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                "Visit http://localhost:3001 to see your site in full glory!"
            )
        )
