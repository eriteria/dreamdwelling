# DreamDwelling Dummy Data Generator

This directory contains Django management commands for generating realistic dummy data for the DreamDwelling platform.

## Available Commands

### 1. `generate_dummy_data`

Generates comprehensive dummy data including users, neighborhoods, properties, reviews, and more.

```bash
python manage.py generate_dummy_data --users 50 --properties 150 --neighborhoods 10
```

**Options:**

- `--users`: Number of users to create (default: 50)
- `--properties`: Number of properties to create (default: 200)
- `--neighborhoods`: Number of neighborhoods to create (default: 20)

**What it creates:**

- 👥 **Users**: Mix of real estate agents and clients with realistic profiles
- 🏘️ **Neighborhoods**: Locations in major US cities with demographic data
- 🏠 **Properties**: Diverse property types with realistic pricing and details
- 🏘️ **Property Types**: Single family homes, condos, townhouses, luxury homes, etc.
- ✨ **Features**: Swimming pools, fireplaces, granite countertops, and more
- ⭐ **Reviews**: Property reviews with ratings and comments
- 🏡 **Open Houses**: Scheduled events for available properties
- ❤️ **Favorites**: User-saved properties

### 2. `add_property_images`

Adds placeholder images to make properties visually appealing.

```bash
python manage.py add_property_images --images-per-property 4
```

**Options:**

- `--images-per-property`: Average number of images per property (default: 5)

**What it creates:**

- 📸 High-quality placeholder images from Lorem Picsum
- 🏷️ Descriptive captions (Main exterior, Living room, Kitchen, etc.)
- 🖼️ Primary image designation for property listings

### 3. `show_data_stats`

Displays comprehensive statistics about the data in your system.

```bash
python manage.py show_data_stats
```

**What it shows:**

- User counts (agents vs clients)
- Property statistics by status and type
- Price range analytics
- Image, review, and favorite counts
- Neighborhood and feature totals

## Sample Output

After running the full data generation, you'll have:

```
📊 DreamDwelling Data Statistics
==================================================
👥 Users: 51 total
   🏢 Agents: 28
   👤 Clients: 23

🏠 Properties: 150 total
   ✅ Available: 109
   ⏳ Pending: 21
   ✔️ Sold: 13

💰 Price Range:
   Min: $195,576.00
   Max: $4,848,697.00
   Avg: $875,783.37

📸 Images: 615 total (4.1 per property)
⭐ Reviews: 455
🏡 Open Houses: 100
❤️ Favorites: 505
```

## Quick Setup

To populate your DreamDwelling site with comprehensive dummy data:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
..\venv\Scripts\activate

# Generate core data
python manage.py generate_dummy_data --users 50 --properties 150 --neighborhoods 10

# Add property images
python manage.py add_property_images --images-per-property 4

# View statistics
python manage.py show_data_stats
```

## Data Features

The generated data includes:

### 🏠 **Realistic Properties**

- Diverse property types across multiple cities
- Accurate price ranges based on property type
- Detailed descriptions and feature lists
- Geographic coordinates for map integration
- Price history tracking

### 👥 **Authentic Users**

- Real estate agents with license numbers and brokerages
- Clients with varied backgrounds and interests
- Professional bios and contact information

### 🏘️ **Rich Neighborhoods**

- Major US cities (New York, Los Angeles, Chicago, etc.)
- Demographic data (population, median income, age)
- Walkability and transit scores
- Market trend information

### 📊 **Engagement Data**

- Property reviews with realistic ratings distribution
- Scheduled open house events
- User favorites and saved properties
- Property view tracking

## Customization

You can modify the dummy data generation by editing the command files:

- **`generate_dummy_data.py`**: Adjust property types, features, or user profiles
- **`add_property_images.py`**: Change image sources or captions
- **`show_data_stats.py`**: Add new statistics or metrics

## Tips

1. **Start Small**: Test with fewer records first (`--users 10 --properties 20`)
2. **Clear Data**: The command clears existing data before generating new data
3. **Incremental**: You can run the image command separately to add visuals later
4. **Development**: Perfect for showcasing your platform to stakeholders

---

Your DreamDwelling platform is now ready to showcase with beautiful, realistic dummy data! 🎉
