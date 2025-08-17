import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { createRoot, Root } from "react-dom/client";

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

export function PopupCard({ property }: { property: Property }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div style={{ minWidth: 250 }}>
      {property.primary_image && (
        <Image
          src={property.primary_image}
          alt={property.title}
          width={320}
          height={120}
          style={{
            width: "100%",
            height: 120,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
      )}
      <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
        {property.title}
      </h3>
      <p
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#2563eb",
          marginBottom: 8,
        }}
      >
        {formatPrice(property.price)}
        {property.listing_type === "rent" ? "/month" : ""}
      </p>
      <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
        <p>
          {property.bedrooms} bed • {property.bathrooms} bath •{" "}
          {property.square_feet.toLocaleString()} sq ft
        </p>
        <p style={{ textTransform: "capitalize" }}>{property.property_type}</p>
      </div>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>{property.address}</p>
      <div style={{ marginTop: 8 }}>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            backgroundColor:
              property.status === "available"
                ? "#dcfce7"
                : property.status === "pending"
                ? "#fef3c7"
                : "#fee2e2",
            color:
              property.status === "available"
                ? "#166534"
                : property.status === "pending"
                ? "#92400e"
                : "#991b1b",
          }}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </span>
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: "#9ca3af" }}>
        Coordinates: {property.latitude.toFixed(6)},{" "}
        {property.longitude.toFixed(6)}
      </div>
    </div>
  );
}

export default function PropertyMapLeaflet({
  properties,
  center = [39.8283, -98.5795], // Center of USA
  zoom = 4,
  height = "400px",
  onPropertyClick,
  selectedPropertyId,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const popupRootsRef = useRef<Root[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // (popup is defined at module scope)

  // Initialize map function - moved outside useEffect to avoid timing issues
  const initializeMap = useCallback(() => {
    console.log("initializeMap called");
    console.log("mapRef.current:", mapRef.current);
    console.log("mapInstanceRef.current:", mapInstanceRef.current);
    console.log("leafletLoaded:", leafletLoaded);

    if (!mapRef.current) {
      console.log("No mapRef.current available");
      return;
    }

    if (mapInstanceRef.current) {
      console.log("Map instance already exists, exiting initializeMap");
      return;
    }

    const L = (window as any).L;
    console.log("Leaflet object:", L);

    if (!L) {
      console.log("Leaflet library not available");
      setError("Leaflet library not available");
      return;
    }

    try {
      console.log("Creating map with center:", center, "zoom:", zoom);
      // Create map
      const map = L.map(mapRef.current).setView(center, zoom);
      console.log("Map created successfully:", map);

      // Add tile layer
      console.log("Adding tile layer...");
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
      console.log("Tile layer created:", tileLayer);

      tileLayer.addTo(map);
      console.log("Tile layer added to map");

      mapInstanceRef.current = map;
      console.log("Map instance stored in ref");

      setIsLoaded(true);
      console.log("setIsLoaded(true) called - Map initialized successfully");
    } catch (err) {
      console.error("Error in initializeMap:", err);
      setError("Failed to create map");
      console.error("Map creation error:", err);
    }
  }, [center, zoom, leafletLoaded]);

  // Load Leaflet library
  useEffect(() => {
    console.log("Map component mounting, starting Leaflet load...");

    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      try {
        console.log("Loading Leaflet...");

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          console.log("Loading Leaflet CSS...");
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        } else {
          console.log("Leaflet CSS already loaded");
        }

        // Load Leaflet JS
        if (!(window as any).L) {
          console.log("Loading Leaflet JS...");
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => {
            console.log("Leaflet JS loaded successfully");
            setLeafletLoaded(true);
          };
          script.onerror = (error) => {
            console.error("Failed to load Leaflet JS:", error);
            setError("Failed to load map library");
          };
          document.head.appendChild(script);
        } else {
          console.log("Leaflet already available");
          setLeafletLoaded(true);
        }
      } catch (err) {
        console.error("Error in loadLeaflet:", err);
        setError("Failed to initialize map");
      }
    };

    loadLeaflet();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize map when both DOM and Leaflet are ready
  useEffect(() => {
    console.log("Map initialization effect triggered");
    console.log("DOM element available:", !!mapRef.current);
    console.log("Leaflet loaded:", leafletLoaded);
    console.log("Map already created:", !!mapInstanceRef.current);

    // WEIRD DEBUG: Let's check the entire DOM
    console.log("Document body children count:", document.body.children.length);
    console.log("MapRef object:", mapRef);
    console.log("MapRef current type:", typeof mapRef.current);
    console.log("MapRef current value:", mapRef.current);
    console.log("MapRef current === null:", mapRef.current === null);
    console.log("MapRef current === undefined:", mapRef.current === undefined);
    console.log("MapRef current truthiness:", !!mapRef.current);
    console.log(
      "All divs in document:",
      document.querySelectorAll("div").length
    ); // Try to find our div by class
    const mapDivs = document.querySelectorAll(".z-10");
    console.log("Divs with z-10 class:", mapDivs.length);
    if (mapDivs.length > 0) {
      console.log("Found z-10 div:", mapDivs[0]);
    }

    if (mapRef.current && leafletLoaded && !mapInstanceRef.current) {
      console.log("All conditions met, initializing map...");
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        initializeMap();
      }, 50);
    } else {
      // WEIRD WORKAROUND: Let's try to find the element manually and assign it
      setTimeout(() => {
        console.log("Timeout check - DOM element available:", !!mapRef.current);
        const potentialMapDiv = document.querySelector(
          'div[style*="height: 100%"][style*="width: 100%"].z-10'
        );
        console.log("Found potential map div:", potentialMapDiv);

        if (potentialMapDiv && !mapRef.current) {
          console.log("WEIRD FIX: Manually assigning div to mapRef");
          (mapRef as any).current = potentialMapDiv;
        }

        if (mapRef.current && leafletLoaded && !mapInstanceRef.current) {
          console.log(
            "Retry: All conditions met after timeout, initializing map..."
          );
          setTimeout(() => {
            initializeMap();
          }, 50);
        }
      }, 200);
    }
  }, [leafletLoaded, initializeMap]);

  // Additional check with useLayoutEffect (runs before DOM paint)
  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT: DOM element available:", !!mapRef.current);
    console.log("LAYOUT EFFECT: Document ready state:", document.readyState);

    if (mapRef.current) {
      console.log("LAYOUT EFFECT: Found mapRef.current!", mapRef.current);
      console.log("LAYOUT EFFECT: Element dimensions:", {
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
        clientWidth: mapRef.current.clientWidth,
        clientHeight: mapRef.current.clientHeight,
      });
    }
  });

  const updateMarkers = useCallback(() => {
    console.log("updateMarkers called with properties:", properties.length);

    if (!mapInstanceRef.current || !isLoaded) {
      console.log("Map not ready:", {
        mapInstance: !!mapInstanceRef.current,
        isLoaded,
      });
      return;
    }

    const L = (window as any).L;
    if (!L) {
      console.log("Leaflet not available");
      return;
    }

    console.log("Starting marker update process...");

    // Clear existing markers and unmount popup roots
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];
    popupRootsRef.current.forEach((root) => {
      try {
        root.unmount();
      } catch {}
    });
    popupRootsRef.current = [];

    // Add new markers
    if (properties.length > 0) {
      console.log("Processing", properties.length, "properties");

      // Filter for more restrictive valid coordinates (US bounds approximately)
      const validProperties = properties.filter(
        (p) =>
          p.latitude &&
          p.longitude &&
          p.latitude >= 20 && // Southern US bound
          p.latitude <= 50 && // Northern US bound
          p.longitude >= -130 && // Western US bound
          p.longitude <= -65 && // Eastern US bound
          p.latitude !== 0 &&
          p.longitude !== 0
      );

      console.log(
        `Total properties: ${properties.length}, Valid US coordinates: ${validProperties.length}`
      );

      // Log a few examples for debugging
      if (properties.length > 0) {
        console.log(
          "Sample properties:",
          properties.slice(0, 3).map((p) => ({
            id: p.id,
            lat: p.latitude,
            lng: p.longitude,
            valid:
              p.latitude >= -90 &&
              p.latitude <= 90 &&
              p.longitude >= -180 &&
              p.longitude <= 180,
          }))
        );
      }

      if (validProperties.length > 0) {
        validProperties.forEach((property) => {
          const marker = L.marker([property.latitude, property.longitude]);

          // Create React popup content
          const container = document.createElement("div");
          const root = createRoot(container);
          root.render(<PopupCard property={property} />);
          marker.bindPopup(container);

          // Add click handler
          marker.on("click", () => {
            if (onPropertyClick) {
              onPropertyClick(property);
            }
          });

          // Unmount React root when popup closes
          marker.on("popupclose", () => {
            try {
              root.unmount();
            } catch {}
          });

          marker.addTo(mapInstanceRef.current);
          markersRef.current.push(marker);
          popupRootsRef.current.push(root);
        });

        // Fit bounds to show all properties
        const group = L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds(), {
          padding: [20, 20],
        });
      } else {
        // No valid properties, show error message in popup
        const errorMessage = `
          <div style="text-align: center; padding: 20px;">
            <h3 style="color: #ef4444;">No Valid Locations Found</h3>
            <p>All ${properties.length} properties have invalid coordinates.</p>
            <p style="font-size: 12px; color: #6b7280;">
              Please check the data source.
            </p>
          </div>
        `;

        // Create a marker at the center with error info
        const errorMarker = L.marker(center)
          .addTo(mapInstanceRef.current)
          .bindPopup(errorMessage)
          .openPopup();

        markersRef.current.push(errorMarker);
      }
    } else {
      console.log("No properties to display");
    }

    console.log("updateMarkers completed");
  }, [center, isLoaded, onPropertyClick, properties]);

  useEffect(() => {
    console.log(
      "useEffect triggered - isLoaded:",
      isLoaded,
      "properties:",
      properties.length
    );
    if (isLoaded && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [isLoaded, updateMarkers, properties.length]);

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

  if (!isLoaded) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-300"
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <div
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      />
    </div>
  );
}
