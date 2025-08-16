/**
 * Enhanced admin map functionality for properties
 * Syncs location point field with latitude/longitude fields
 */

document.addEventListener("DOMContentLoaded", function () {
  // Find the map widget and coordinate fields
  const mapWidget = document.querySelector(".gis-widget");
  const latField = document.querySelector("#id_latitude");
  const lonField = document.querySelector("#id_longitude");

  if (!mapWidget || !latField || !lonField) {
    return;
  }

  // Function to sync coordinates from map to lat/lng fields
  function syncCoordinates() {
    try {
      // Get the map instance (this depends on the GIS widget implementation)
      const map = mapWidget._map;
      if (map && map.layers && map.layers.length > 0) {
        const layer = map.layers.find(
          (l) => l.features && l.features.length > 0
        );
        if (layer && layer.features.length > 0) {
          const feature = layer.features[0];
          if (feature.geometry) {
            const coords = feature.geometry.coordinates;
            if (coords && coords.length >= 2) {
              // OpenLayers uses [lon, lat] format
              lonField.value = coords[0].toFixed(6);
              latField.value = coords[1].toFixed(6);
            }
          }
        }
      }
    } catch (e) {
      console.log("Could not sync coordinates:", e);
    }
  }

  // Function to sync lat/lng fields to map
  function syncToMap() {
    const lat = parseFloat(latField.value);
    const lon = parseFloat(lonField.value);

    if (!isNaN(lat) && !isNaN(lon)) {
      // Update the location field (this is widget-specific)
      const locationField = document.querySelector("#id_location");
      if (locationField) {
        locationField.value = `POINT (${lon} ${lat})`;
        // Trigger change event to update the map
        locationField.dispatchEvent(new Event("change"));
      }
    }
  }

  // Add event listeners
  if (latField && lonField) {
    latField.addEventListener("change", syncToMap);
    lonField.addEventListener("change", syncToMap);
  }

  // Try to sync coordinates when map is loaded
  setTimeout(syncCoordinates, 1000);

  // Periodically check for coordinate updates from map interactions
  setInterval(syncCoordinates, 2000);

  // Geocoding functionality
  const geocodeButton = document.createElement("button");
  geocodeButton.type = "button";
  geocodeButton.textContent = "Geocode Address";
  geocodeButton.className = "btn btn-primary";
  geocodeButton.style.margin = "10px 0";

  geocodeButton.addEventListener("click", function () {
    const address = [
      document.querySelector("#id_address_line1")?.value,
      document.querySelector("#id_city")?.value,
      document.querySelector("#id_state")?.value,
      document.querySelector("#id_zip_code")?.value,
    ]
      .filter(Boolean)
      .join(", ");

    if (address) {
      geocodeAddress(address);
    } else {
      alert("Please fill in the address fields first.");
    }
  });

  // Add geocode button near the location fields
  const locationFieldset = document
    .querySelector("fieldset")
    .querySelector("h2");
  if (locationFieldset && locationFieldset.textContent.includes("Location")) {
    locationFieldset.parentNode.insertBefore(
      geocodeButton,
      locationFieldset.nextSibling
    );
  }

  function geocodeAddress(address) {
    // Using Nominatim (free OpenStreetMap geocoding service)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}&limit=1`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);

          // Update coordinate fields
          latField.value = lat.toFixed(6);
          lonField.value = lon.toFixed(6);

          // Update map
          syncToMap();

          alert(
            `Address geocoded successfully!\nLatitude: ${lat}\nLongitude: ${lon}`
          );
        } else {
          alert("Address not found. Please check the address and try again.");
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error);
        alert("Error geocoding address. Please try again later.");
      });
  }
});
