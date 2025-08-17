"""
Management command to create a standalone Leaflet map test page that includes properties.
"""

from django.core.management.base import BaseCommand
from django.core.serializers.json import DjangoJSONEncoder
from properties.models import Property
import json
import os


class Command(BaseCommand):
    """
    Creates a standalone Leaflet map test page that includes properties.
    """

    help = "Creates a standalone Leaflet map test page"

    def handle(self, *args, **options):
        """
        Run the command.
        """
        try:
            # Get all properties
            properties = Property.objects.filter(
                latitude__isnull=False, longitude__isnull=False
            )
            total_count = properties.count()

            self.stdout.write(f"Total properties with coordinates: {total_count}")

            # Prepare property data for JSON
            property_data = []
            for prop in properties:
                property_data.append(
                    {
                        "id": prop.id,
                        "title": prop.title,
                        "address_line1": prop.address_line1,
                        "city": prop.city,
                        "state": prop.state,
                        "latitude": float(prop.latitude),
                        "longitude": float(prop.longitude),
                        "price": float(prop.price),
                        "bedrooms": prop.bedrooms,
                        "bathrooms": float(prop.bathrooms),
                        "square_feet": prop.square_feet,
                        "status": prop.status,
                        "listing_type": prop.listing_type,
                    }
                )

            # Convert to JSON
            properties_json = json.dumps(property_data, cls=DjangoJSONEncoder)

            # Create HTML content
            html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Map Test</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css?v=20250816" />
    <style>
        body {{
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }}
        h1 {{
            color: #417690;
            margin-bottom: 20px;
        }}
        #map {{
            width: 100%;
            height: 600px;
            border: 1px solid #ccc;
            margin-bottom: 20px;
        }}
        .debug-info {{
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
        }}
        .property-list {{
            height: 300px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 10px;
        }}
        .property-item {{
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }}
        .property-item:hover {{
            background-color: #f5f5f5;
        }}
        .property-item.active {{
            background-color: #e8f4f8;
        }}
        .property-title {{
            font-weight: bold;
            margin-bottom: 5px;
        }}
        .property-address {{
            color: #666;
            font-size: 0.9em;
        }}
        .property-details {{
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
        }}
        .property-price {{
            color: #417690;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <h1>Property Map Test</h1>
    <div style="display: flex; flex-wrap: wrap;">
        <div style="flex: 3; min-width: 300px; padding-right: 20px;">
            <div id="map"></div>
            <div class="debug-info">
                <h3>Debug Info</h3>
                <div id="debug"></div>
            </div>
        </div>
        <div style="flex: 1; min-width: 250px;">
            <h2>Properties</h2>
            <div id="property-list" class="property-list"></div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js?v=20250816"></script>
    <script>
        function log(message) {{
            console.log(message);
            document.getElementById('debug').innerHTML += `<p>${{message}}</p>`;
        }}

        document.addEventListener('DOMContentLoaded', function() {{
            try {{
                log('Initializing map...');
                
                // Create map
                const map = L.map('map').setView([39.8283, -98.5795], 4);
                log('Map initialized');
                
                // Add tile layer
                L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }}).addTo(map);
                log('Tile layer added');
                
                // Parse property data
                const propertiesData = {properties_json};
                log(`Loaded ${{propertiesData.length}} properties`);
                
                const markers = {{}};
                let hasValidProperties = false;
                const propertyListElement = document.getElementById('property-list');
                
                // Add property markers and list items
                propertiesData.forEach(property => {{
                    try {{
                        if (property.latitude && property.longitude) {{
                            hasValidProperties = true;
                            
                            // Create marker
                            const marker = L.marker([property.latitude, property.longitude])
                                .addTo(map)
                                .bindPopup(
                                    `<strong>${{property.title}}</strong><br>
                                    ${{property.address_line1}}, ${{property.city}}, ${{property.state}}<br>
                                    ${{property.bedrooms}} bd | ${{property.bathrooms}} ba | ${{property.square_feet}} sqft<br>
                                    <strong>$${{property.price.toLocaleString()}}</strong><br>`
                                );
                            
                            marker.propertyId = property.id;
                            markers[property.id] = marker;
                            
                            marker.on('click', function() {{
                                highlightProperty(property.id);
                            }});
                            
                            // Create list item
                            const listItem = document.createElement('div');
                            listItem.className = 'property-item';
                            listItem.dataset.id = property.id;
                            listItem.innerHTML = `
                                <div class="property-title">${{property.title}}</div>
                                <div class="property-address">${{property.address_line1}}, ${{property.city}}, ${{property.state}}</div>
                                <div class="property-details">
                                    <span>${{property.bedrooms}} bd | ${{property.bathrooms}} ba | ${{property.square_feet}} sqft</span>
                                    <span class="property-price">$${{property.price.toLocaleString()}}</span>
                                </div>
                            `;
                            
                            listItem.addEventListener('click', function() {{
                                const id = parseInt(this.dataset.id);
                                const marker = markers[id];
                                
                                if (marker) {{
                                    map.setView([marker._latlng.lat, marker._latlng.lng], 14);
                                    marker.openPopup();
                                    highlightProperty(id);
                                }}
                            }});
                            
                            propertyListElement.appendChild(listItem);
                        }}
                    }} catch(e) {{
                        log(`Error adding property ${{property.id}}: ${{e.message}}`);
                    }}
                }});
                
                // Highlight selected property
                function highlightProperty(propertyId) {{
                    document.querySelectorAll('.property-item').forEach(function(item) {{
                        item.classList.remove('active');
                        if (parseInt(item.dataset.id) === propertyId) {{
                            item.classList.add('active');
                            item.scrollIntoView({{ behavior: 'smooth', block: 'nearest' }});
                        }}
                    }});
                }}
                
                // Fit bounds if we have properties
                if (hasValidProperties) {{
                    const bounds = Object.values(markers).map(marker => [marker._latlng.lat, marker._latlng.lng]);
                    map.fitBounds(bounds);
                    log('Map bounds adjusted to show all properties');
                }} else {{
                    log('No valid properties with coordinates found');
                }}
                
                log('Map setup complete');
                
            }} catch(e) {{
                log(`ERROR: ${{e.message}}`);
                console.error(e);
            }}
        }});
    </script>
</body>
</html>
            """

            # Write to file
            output_path = os.path.join(
                "properties",
                "templates",
                "admin",
                "properties",
                "property",
                "standalone_map.html",
            )
            with open(output_path, "w") as f:
                f.write(html_content)

            self.stdout.write(
                self.style.SUCCESS(f"Standalone map test page created at {output_path}")
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
            import traceback

            self.stdout.write(traceback.format_exc())
