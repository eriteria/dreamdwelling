import { useEffect, useState, useCallback } from "react";

interface Property {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  address: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  listing_type: string;
  status: string;
  primary_image?: string;
}

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPropertyClick?: (property: Property) => void;
  selectedPropertyId?: number;
}

export default function PropertyMapWorking({
  properties,
  center = [39.8283, -98.5795], // Center of USA
  zoom = 4,
  height = "400px",
  onPropertyClick,
  selectedPropertyId,
}: PropertyMapProps) {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  // Callback ref to get the map container
  const mapCallbackRef = useCallback((node: HTMLDivElement | null) => {
    console.log("Callback ref called with node:", node);
    if (node !== null) {
      setMapContainer(node);
    }
  }, []);

  // Load Leaflet
  useEffect(() => {
    console.log("Loading Leaflet...");

    const loadLeaflet = async () => {
      try {
        // Load CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // Load JS
        if (!(window as any).L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => {
            console.log("Leaflet loaded via script");
            setLeafletLoaded(true);
          };
          script.onerror = () => {
            setError("Failed to load Leaflet");
          };
          document.head.appendChild(script);
        } else {
          console.log("Leaflet already available");
          setLeafletLoaded(true);
        }
      } catch (err) {
        console.error("Error loading Leaflet:", err);
        setError("Failed to load map library");
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map when both container and Leaflet are ready
  useEffect(() => {
    console.log(
      "Map initialization effect - container:",
      !!mapContainer,
      "leaflet:",
      leafletLoaded,
      "existing map:",
      !!mapInstance
    );

    if (mapContainer && leafletLoaded && !mapInstance) {
      const L = (window as any).L;
      if (!L) {
        setError("Leaflet not available");
        return;
      }

      try {
        console.log("Creating map...");
        const map = L.map(mapContainer).setView(center, zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        setMapInstance(map);
        console.log("Map created successfully!");
      } catch (err) {
        console.error("Error creating map:", err);
        setError("Failed to create map");
      }
    }
  }, [mapContainer, leafletLoaded, mapInstance, center, zoom]);

  // Update markers when properties change
  useEffect(() => {
    if (!mapInstance || !leafletLoaded) {
      console.log("Skipping marker update - map not ready");
      return;
    }

    console.log("Updating markers with", properties.length, "properties");

    const L = (window as any).L;

    // Clear existing markers (we'll store them as map._markers if needed)
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Filter valid properties (US bounds)
    const validProperties = properties.filter(
      (p) =>
        p.latitude &&
        p.longitude &&
        p.latitude >= 20 &&
        p.latitude <= 50 &&
        p.longitude >= -130 &&
        p.longitude <= -65
    );

    console.log(
      `Valid properties: ${validProperties.length} out of ${properties.length}`
    );

    if (validProperties.length > 0) {
      const markers: any[] = [];

      validProperties.forEach((property) => {
        const marker = L.marker([property.latitude, property.longitude]);

        const formatPrice = (price: number) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(price);
        };

        const popupContent = `
          <div style="min-width: 250px;">
            <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 4px;">${
              property.title
            }</h3>
            <p style="font-size: 20px; font-weight: 700; color: #2563eb; margin-bottom: 8px;">
              ${formatPrice(property.price)}${
          property.listing_type === "rent" ? "/month" : ""
        }
            </p>
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              <p>${property.bedrooms} bed • ${
          property.bathrooms
        } bath • ${property.square_feet.toLocaleString()} sq ft</p>
              <p style="text-transform: capitalize;">${
                property.property_type
              }</p>
            </div>
            <p style="font-size: 14px; color: #9ca3af;">${property.address}</p>
            <div style="margin-top: 8px;">
              <span style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${
                property.status === "available"
                  ? "background-color: #dcfce7; color: #166534;"
                  : property.status === "pending"
                  ? "background-color: #fef3c7; color: #92400e;"
                  : "background-color: #fee2e2; color: #991b1b;"
              }">
                ${
                  property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)
                }
              </span>
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: #9ca3af;">
              Coordinates: ${property.latitude.toFixed(
                6
              )}, ${property.longitude.toFixed(6)}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        if (onPropertyClick) {
          marker.on("click", () => onPropertyClick(property));
        }

        marker.addTo(mapInstance);
        markers.push(marker);
      });

      // Fit bounds
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        mapInstance.fitBounds(group.getBounds(), {
          padding: [20, 20],
          maxZoom: 10,
        });
      }
    } else {
      // Show error marker for invalid coordinates
      const errorMarker = L.marker(center)
        .addTo(mapInstance)
        .bindPopup(
          `
          <div style="text-align: center; padding: 20px;">
            <h3 style="color: #ef4444;">No Valid Locations Found</h3>
            <p>All ${properties.length} properties have invalid coordinates.</p>
            <p style="font-size: 12px; color: #6b7280;">
              US coordinates required (lat: 20-50, lng: -130 to -65).
            </p>
            <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">
              Sample: ${properties[0]?.latitude}, ${properties[0]?.longitude}
            </p>
          </div>
        `
        )
        .openPopup();
    }
  }, [mapInstance, properties, leafletLoaded, onPropertyClick, center]);

  if (error) {
    return (
      <div
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center transition-colors duration-300"
        style={{ height }}
      >
        <div className="text-red-700 dark:text-red-400 text-center">
          <p className="font-medium">Map Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-300"
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div>Loading map library...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <div
        ref={mapCallbackRef}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      />
    </div>
  );
}
