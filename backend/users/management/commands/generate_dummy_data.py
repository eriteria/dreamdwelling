"""
DreamDwelling Dummy Data Generator

This script creates realistic dummy data for the DreamDwelling platform including:
- Users (agents and clients)
- Neighborhoods with demographic data
- Property types and features
- Properties with images and details
- Reviews and open houses
- Favorites and analytics data

Run this script from the Django management commands directory.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from decimal import Decimal
import random
from datetime import timedelta
from faker import Faker

# Import models
from properties.models import PropertyType, Feature, Property, PropertyReview, OpenHouse
from neighborhoods.models import Neighborhood, School
from favorites.models import Favorite

User = get_user_model()
fake = Faker()


class Command(BaseCommand):
    help = "Generate dummy data for DreamDwelling platform"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users", type=int, default=50, help="Number of users to create"
        )
        parser.add_argument(
            "--properties", type=int, default=200, help="Number of properties to create"
        )
        parser.add_argument(
            "--neighborhoods",
            type=int,
            default=20,
            help="Number of neighborhoods to create",
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS("🏠 Starting DreamDwelling dummy data generation...")
        )

        # Clear existing data
        self.clear_existing_data()

        # Create data
        users = self.create_users(options["users"])
        property_types = self.create_property_types()
        features = self.create_features()
        neighborhoods = self.create_neighborhoods(options["neighborhoods"])
        properties = self.create_properties(
            options["properties"], users, property_types, features, neighborhoods
        )

        # Create related data
        self.create_property_reviews(properties, users)
        self.create_open_houses(properties, users)
        self.create_favorites(properties, users)

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Successfully created dummy data:\n"
                f"   👥 {len(users)} users\n"
                f"   🏠 {len(properties)} properties\n"
                f"   🏘️  {len(neighborhoods)} neighborhoods\n"
                f"   📊 Reviews and open houses data"
            )
        )

    def clear_existing_data(self):
        """Clear existing data to start fresh."""
        self.stdout.write("🗑️  Clearing existing data...")

        # Clear in reverse order of dependencies
        Favorite.objects.all().delete()
        OpenHouse.objects.all().delete()
        PropertyReview.objects.all().delete()
        Property.objects.all().delete()
        School.objects.all().delete()
        Neighborhood.objects.all().delete()
        Feature.objects.all().delete()
        PropertyType.objects.all().delete()

        # Keep superusers but remove regular users
        User.objects.filter(is_superuser=False).delete()

    def create_users(self, count):
        """Create realistic users including agents and clients."""
        self.stdout.write(f"👥 Creating {count} users...")

        users = []

        for i in range(count):
            is_agent = random.choice([True, False])

            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f"{first_name.lower()}.{last_name.lower()}@{fake.domain_name()}"

            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
                phone_number=fake.phone_number()[:15],
                bio=self.generate_user_bio(is_agent),
                is_agent=is_agent,
                license_number=fake.bothify("##?####") if is_agent else "",
                brokerage=fake.company() if is_agent else "",
                date_joined=fake.date_time_between(
                    start_date="-2y",
                    end_date="now",
                    tzinfo=timezone.get_current_timezone(),
                ),
            )

            users.append(user)

        return users

    def generate_user_bio(self, is_agent):
        """Generate appropriate bio based on user type."""
        if is_agent:
            years_exp = random.randint(2, 20)
            specialties = random.sample(
                [
                    "luxury homes",
                    "first-time buyers",
                    "investment properties",
                    "commercial real estate",
                    "condominiums",
                    "waterfront properties",
                    "new construction",
                    "historic homes",
                ],
                random.randint(1, 3),
            )

            return f"Licensed real estate agent with {years_exp} years of experience specializing in {', '.join(specialties)}. Committed to helping clients find their dream homes and make smart real estate investments."

        else:  # client
            return fake.text(max_nb_chars=200)

    def create_property_types(self):
        """Create property types."""
        self.stdout.write("🏘️  Creating property types...")

        property_types_data = [
            ("Single Family Home", "Detached house with private lot"),
            ("Condominium", "Unit in a multi-unit building with shared amenities"),
            ("Townhouse", "Multi-level home sharing walls with neighbors"),
            ("Multi-Family", "Property with multiple separate housing units"),
            ("Apartment", "Rental unit in larger residential building"),
            ("Mobile Home", "Manufactured home in mobile home park"),
            ("Land", "Vacant lot suitable for development"),
            ("Commercial", "Property for business use"),
            ("Luxury Home", "High-end residential property with premium features"),
            ("Penthouse", "Top-floor luxury apartment with premium amenities"),
        ]

        property_types = []
        for name, description in property_types_data:
            pt = PropertyType.objects.create(name=name, description=description)
            property_types.append(pt)

        return property_types

    def create_features(self):
        """Create property features."""
        self.stdout.write("✨ Creating property features...")

        features_data = [
            # Indoor features
            ("Hardwood Floors", "Indoor", "home"),
            ("Granite Countertops", "Indoor", "kitchen-set"),
            ("Stainless Steel Appliances", "Indoor", "blender"),
            ("Walk-in Closet", "Indoor", "tshirt"),
            ("Fireplace", "Indoor", "fire"),
            ("Vaulted Ceilings", "Indoor", "arrows-alt-v"),
            ("Updated Kitchen", "Indoor", "utensils"),
            ("Master Suite", "Indoor", "bed"),
            ("Home Office", "Indoor", "laptop"),
            ("Basement", "Indoor", "layer-group"),
            # Outdoor features
            ("Swimming Pool", "Outdoor", "swimmer"),
            ("Hot Tub", "Outdoor", "hot-tub"),
            ("Patio", "Outdoor", "chair"),
            ("Deck", "Outdoor", "table"),
            ("Garden", "Outdoor", "seedling"),
            ("Fenced Yard", "Outdoor", "border-style"),
            ("Outdoor Kitchen", "Outdoor", "utensils"),
            ("Pool House", "Outdoor", "home"),
            ("Tennis Court", "Outdoor", "table-tennis"),
            ("Guest House", "Outdoor", "bed"),
            # Security features
            ("Security System", "Security", "shield-alt"),
            ("Gated Community", "Security", "lock"),
            ("Doorman", "Security", "user-tie"),
            ("Video Surveillance", "Security", "video"),
            ("Intercom System", "Security", "phone"),
            # Parking features
            ("Garage", "Parking", "car"),
            ("Covered Parking", "Parking", "parking"),
            ("Driveway", "Parking", "road"),
            ("Valet Parking", "Parking", "concierge-bell"),
            # Amenities
            ("Gym/Fitness Center", "Amenities", "dumbbell"),
            ("Concierge", "Amenities", "concierge-bell"),
            ("Rooftop Terrace", "Amenities", "city"),
            ("Business Center", "Amenities", "briefcase"),
            ("Children's Playground", "Amenities", "child"),
            ("Pet-Friendly", "Amenities", "paw"),
            ("Laundry Room", "Amenities", "tshirt"),
            ("Storage Unit", "Amenities", "boxes"),
        ]

        features = []
        for name, category, icon in features_data:
            feature = Feature.objects.create(name=name, category=category, icon=icon)
            features.append(feature)

        return features

    def create_neighborhoods(self, count):
        """Create neighborhoods with realistic data."""
        self.stdout.write(f"🏘️  Creating {count} neighborhoods...")

        # Major US cities for realistic neighborhoods
        cities_data = [
            ("New York", "NY", ["10001", "10002", "10003"]),
            ("Los Angeles", "CA", ["90210", "90211", "90212"]),
            ("Chicago", "IL", ["60601", "60602", "60603"]),
            ("Miami", "FL", ["33101", "33102", "33103"]),
            ("San Francisco", "CA", ["94101", "94102", "94103"]),
            ("Boston", "MA", ["02101", "02102", "02103"]),
            ("Seattle", "WA", ["98101", "98102", "98103"]),
            ("Austin", "TX", ["73301", "73302", "73303"]),
            ("Denver", "CO", ["80201", "80202", "80203"]),
            ("Atlanta", "GA", ["30301", "30302", "30303"]),
        ]

        neighborhood_names = [
            "Downtown",
            "Midtown",
            "Uptown",
            "Old Town",
            "Financial District",
            "Arts District",
            "Historic District",
            "Waterfront",
            "Hillside",
            "Park View",
            "Garden District",
            "University Area",
            "Tech Hub",
            "Marina District",
            "Riverside",
            "Heights",
            "Commons",
            "Square",
            "Village",
            "Creek Side",
            "Oak Park",
            "Pine Ridge",
            "Sunset",
            "Sunrise",
            "Lakefront",
            "Brookside",
            "Meadows",
            "Highlands",
        ]

        neighborhoods = []

        for i in range(count):
            city, state, zip_codes = random.choice(cities_data)
            name = f"{random.choice(neighborhood_names)} {city}"

            # Create realistic boundary points (simple square for demo)
            lat_base = fake.latitude()
            lng_base = fake.longitude()
            boundary_points = [
                [float(lng_base), float(lat_base)],
                [float(lng_base) + 0.01, float(lat_base)],
                [float(lng_base) + 0.01, float(lat_base) + 0.01],
                [float(lng_base), float(lat_base) + 0.01],
                [float(lng_base), float(lat_base)],  # Close the polygon
            ]

            neighborhood = Neighborhood.objects.create(
                name=name,
                city=city,
                state=state,
                zip_codes=",".join(
                    random.sample(zip_codes, random.randint(1, len(zip_codes)))
                ),
                boundary_points=boundary_points,
                description=self.generate_neighborhood_description(name, city),
                median_home_price=Decimal(random.randint(200000, 2000000)),
                median_rent=Decimal(random.randint(1200, 8000)),
                population=random.randint(5000, 100000),
                median_age=Decimal(random.randint(25, 65)),
                median_income=Decimal(random.randint(40000, 200000)),
                price_growth_1yr=Decimal(random.uniform(-5.0, 15.0)),
                rent_growth_1yr=Decimal(random.uniform(-2.0, 10.0)),
                walk_score=random.randint(30, 100),
                transit_score=random.randint(20, 90),
                bike_score=random.randint(20, 85),
            )

            neighborhoods.append(neighborhood)

        return neighborhoods

    def generate_neighborhood_description(self, name, city):
        """Generate realistic neighborhood description."""
        descriptors = [
            "vibrant",
            "quiet",
            "family-friendly",
            "trendy",
            "historic",
            "up-and-coming",
            "established",
            "diverse",
            "walkable",
            "charming",
        ]

        amenities = [
            "great restaurants",
            "shopping centers",
            "parks",
            "schools",
            "public transportation",
            "entertainment venues",
            "cafes",
            "fitness centers",
            "museums",
            "theaters",
        ]

        return f"{name} is a {random.choice(descriptors)} neighborhood in {city} known for its {random.choice(amenities)} and {random.choice(amenities)}. The area offers excellent {random.choice(['walkability', 'dining options', 'nightlife', 'family amenities', 'cultural attractions'])} and is conveniently located near major {random.choice(['business districts', 'universities', 'hospitals', 'shopping areas'])}."

    def create_properties(self, count, users, property_types, features, neighborhoods):
        """Create realistic property listings."""
        self.stdout.write(f"🏠 Creating {count} properties...")

        properties = []

        # Filter for agents to list properties
        agents = [u for u in users if u.is_agent]
        if not agents:
            agents = users[:10]  # Use first 10 users as agents if no specific agents

        for i in range(count):
            neighborhood = random.choice(neighborhoods)
            property_type = random.choice(property_types)

            # Generate realistic property details based on type
            bedrooms, bathrooms, sqft, price = self.generate_property_specs(
                property_type.name
            )

            # Generate address
            address_line1 = f"{random.randint(100, 9999)} {fake.street_name()}"

            # Generate coordinates near the neighborhood
            if neighborhood.boundary_points:
                # Get a random point within the neighborhood boundary
                base_coords = random.choice(
                    neighborhood.boundary_points[:-1]
                )  # Exclude duplicate closing point
                lat = float(base_coords[1]) + random.uniform(-0.005, 0.005)
                lng = float(base_coords[0]) + random.uniform(-0.005, 0.005)
            else:
                lat = float(fake.latitude())
                lng = float(fake.longitude())

            # Create property
            property_obj = Property.objects.create(
                title=self.generate_property_title(
                    property_type.name, neighborhood.city
                ),
                description=self.generate_property_description(
                    property_type.name, bedrooms, bathrooms
                ),
                property_type=property_type,
                status=random.choices(
                    ["available", "pending", "sold", "off_market"],
                    weights=[70, 15, 10, 5],
                )[0],
                listing_type=random.choices(
                    ["sale", "rent", "both"], weights=[60, 35, 5]
                )[0],
                # Address
                address_line1=address_line1,
                address_line2=random.choice(
                    [
                        "",
                        f"Apt {random.randint(1, 50)}",
                        f"Unit {random.randint(1, 100)}",
                    ]
                ),
                city=neighborhood.city,
                state=neighborhood.state,
                zip_code=random.choice(neighborhood.zip_codes.split(",")),
                latitude=lat,
                longitude=lng,
                # Pricing
                price=Decimal(price),
                price_per_sqft=Decimal(price / sqft) if sqft > 0 else None,
                monthly_rent=Decimal(price * 0.004)
                if random.choice([True, False])
                else None,
                hoa_fee=Decimal(random.randint(0, 800))
                if random.choice([True, False])
                else None,
                # Details
                bedrooms=bedrooms,
                bathrooms=Decimal(bathrooms),
                half_bathrooms=random.randint(0, 2),
                square_feet=sqft,
                lot_size=Decimal(random.randint(1000, 50000))
                if property_type.name in ["Single Family Home", "Land"]
                else None,
                year_built=random.randint(1950, 2024),
                parking_spaces=random.randint(0, 4),
                # Features
                has_air_conditioning=random.choice([True, False]),
                has_heating=True,
                pets_allowed=random.choice([True, False]),
                furnished=random.choice([True, False]),
                # Listing info
                listed_by=random.choice(agents),
                published_at=fake.date_time_between(
                    start_date="-1y",
                    end_date="now",
                    tzinfo=timezone.get_current_timezone(),
                ),
                views_count=random.randint(0, 1000),
                favorites_count=random.randint(0, 50),
                # Virtual tour
                virtual_tour_url=f"https://virtualtour.example.com/property/{i}"
                if random.choice([True, False])
                else "",
                # Price history
                price_history=self.generate_price_history(price),
            )

            # Add random features
            property_features = random.sample(features, random.randint(3, 8))
            property_obj.features.add(*property_features)

            properties.append(property_obj)

        return properties

    def generate_property_specs(self, property_type):
        """Generate realistic bedrooms, bathrooms, sqft, and price based on property type."""
        if property_type == "Single Family Home":
            bedrooms = random.randint(2, 6)
            bathrooms = random.uniform(1.5, 4.5)
            sqft = random.randint(1200, 4500)
            price = random.randint(250000, 1200000)
        elif property_type == "Condominium":
            bedrooms = random.randint(1, 3)
            bathrooms = random.uniform(1.0, 2.5)
            sqft = random.randint(600, 2000)
            price = random.randint(180000, 800000)
        elif property_type == "Townhouse":
            bedrooms = random.randint(2, 4)
            bathrooms = random.uniform(1.5, 3.5)
            sqft = random.randint(1000, 2500)
            price = random.randint(200000, 600000)
        elif property_type == "Apartment":
            bedrooms = random.randint(0, 3)
            bathrooms = random.uniform(1.0, 2.0)
            sqft = random.randint(400, 1500)
            price = random.randint(150000, 500000)
        elif property_type == "Luxury Home":
            bedrooms = random.randint(4, 8)
            bathrooms = random.uniform(3.5, 8.0)
            sqft = random.randint(3000, 10000)
            price = random.randint(800000, 5000000)
        elif property_type == "Penthouse":
            bedrooms = random.randint(2, 5)
            bathrooms = random.uniform(2.0, 4.5)
            sqft = random.randint(1500, 4000)
            price = random.randint(500000, 3000000)
        else:  # Default for other types
            bedrooms = random.randint(1, 4)
            bathrooms = random.uniform(1.0, 3.0)
            sqft = random.randint(800, 2500)
            price = random.randint(200000, 800000)

        return bedrooms, round(bathrooms, 1), sqft, price

    def generate_property_title(self, property_type, city):
        """Generate attractive property titles."""
        adjectives = [
            "Stunning",
            "Beautiful",
            "Luxurious",
            "Charming",
            "Modern",
            "Spacious",
            "Elegant",
            "Updated",
            "Pristine",
            "Gorgeous",
        ]

        return f"{random.choice(adjectives)} {property_type} in {city}"

    def generate_property_description(self, property_type, bedrooms, bathrooms):
        """Generate detailed property descriptions."""
        descriptions = [
            f"This magnificent {property_type.lower()} features {bedrooms} bedrooms and {bathrooms} bathrooms in a prime location.",
            f"Discover luxury living in this {bedrooms}-bedroom, {bathrooms}-bathroom {property_type.lower()}.",
            f"A rare opportunity to own this exceptional {property_type.lower()} with {bedrooms} bedrooms and {bathrooms} bathrooms.",
            f"Move-in ready {property_type.lower()} offering {bedrooms} bedrooms and {bathrooms} bathrooms with modern amenities.",
        ]

        additional_features = [
            "The property boasts an open floor plan perfect for entertaining.",
            "Features include hardwood floors throughout and a gourmet kitchen.",
            "The master suite includes a walk-in closet and spa-like bathroom.",
            "Large windows provide abundant natural light and city views.",
            "The property includes a private outdoor space and parking.",
            "Recently updated with modern fixtures and appliances.",
            "Located in a desirable neighborhood with excellent schools nearby.",
        ]

        base_description = random.choice(descriptions)
        additional = random.sample(additional_features, random.randint(2, 4))

        return f"{base_description} {' '.join(additional)}"

    def generate_price_history(self, current_price):
        """Generate realistic price history."""
        history = []
        price = current_price

        # Generate 3-6 historical price points
        for i in range(random.randint(3, 6)):
            date = fake.date_between(start_date="-2y", end_date="today")
            # Price variations of ±5-15%
            variation = random.uniform(0.85, 1.15)
            price = int(price * variation)

            history.append(
                {
                    "date": date.isoformat(),
                    "price": price,
                    "change_reason": random.choice(
                        [
                            "Initial listing",
                            "Price reduction",
                            "Market adjustment",
                            "Renovations completed",
                            "Market conditions",
                        ]
                    ),
                }
            )

        return sorted(history, key=lambda x: x["date"])

    def create_property_reviews(self, properties, users):
        """Create property reviews."""
        self.stdout.write("⭐ Creating property reviews...")

        # Create reviews for random properties
        reviewed_properties = random.sample(properties, min(len(properties), 100))

        for property_obj in reviewed_properties:
            # Random number of reviews per property
            num_reviews = random.randint(1, 8)
            reviewers = random.sample(users, min(len(users), num_reviews))

            for user in reviewers:
                rating = random.choices(
                    [1, 2, 3, 4, 5],
                    weights=[5, 10, 15, 35, 35],  # Skew toward positive reviews
                )[0]

                comment = self.generate_review_comment(rating)

                PropertyReview.objects.create(
                    property=property_obj,
                    user=user,
                    rating=rating,
                    comment=comment,
                    created_at=fake.date_time_between(
                        start_date="-1y",
                        end_date="now",
                        tzinfo=timezone.get_current_timezone(),
                    ),
                )

    def generate_review_comment(self, rating):
        """Generate review comments based on rating."""
        if rating >= 4:
            comments = [
                "Beautiful property in a great location! The amenities are fantastic and the neighborhood is very safe.",
                "Loved everything about this place. The photos don't do it justice - it's even better in person!",
                "Perfect home for our family. The layout is great and the kitchen is amazing.",
                "Excellent property with modern updates throughout. Highly recommend viewing this one!",
                "Outstanding value for the price. The owner was very responsive and helpful.",
            ]
        elif rating == 3:
            comments = [
                "Nice property overall but could use some updates. Good location though.",
                "Decent place with good bones. A few minor issues but nothing major.",
                "Fair price for what you get. The neighborhood is quiet and convenient.",
                "Acceptable property, meets basic needs. Some wear and tear but livable.",
            ]
        else:
            comments = [
                "Property didn't match the description. Several maintenance issues noted.",
                "Overpriced for the condition. Needs significant work before move-in.",
                "Disappointing compared to the photos. Location is not as described.",
                "Multiple problems discovered during viewing. Would not recommend.",
            ]

        return random.choice(comments)

    def create_open_houses(self, properties, users):
        """Create open house events."""
        self.stdout.write("🏡 Creating open house events...")

        # Create open houses for available properties
        available_properties = [p for p in properties if p.status == "available"]
        open_house_properties = random.sample(
            available_properties, min(len(available_properties), 50)
        )

        agents = [u for u in users if u.is_agent]
        if not agents:
            agents = users[:10]

        for property_obj in open_house_properties:
            # Some properties have multiple open houses
            num_events = random.randint(1, 3)

            for _ in range(num_events):
                # Schedule open houses in the future
                start_time = fake.date_time_between(
                    start_date="now",
                    end_date="+30d",
                    tzinfo=timezone.get_current_timezone(),
                )
                # Typically 2-3 hours long
                end_time = start_time + timedelta(hours=random.randint(2, 3))

                OpenHouse.objects.create(
                    property=property_obj,
                    start_time=start_time,
                    end_time=end_time,
                    description=f"Open house for {property_obj.title}. Come see this beautiful property!",
                    hosted_by=random.choice(agents),
                )

    def create_favorites(self, properties, users):
        """Create user favorites."""
        self.stdout.write("❤️ Creating user favorites...")

        # Each user favorites 5-15 random properties
        for user in users:
            num_favorites = random.randint(5, 15)
            favorite_properties = random.sample(
                properties, min(len(properties), num_favorites)
            )

            for property_obj in favorite_properties:
                Favorite.objects.create(
                    user=user,
                    property=property_obj,
                    created_at=fake.date_time_between(
                        start_date="-6m",
                        end_date="now",
                        tzinfo=timezone.get_current_timezone(),
                    ),
                )
