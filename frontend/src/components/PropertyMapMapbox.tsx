import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, { MapRef, Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PopupCard } from "@/components/PopupCard";

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

interface PropertyMapMapboxProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPropertyClick?: (property: Property) => void;
  selectedPropertyId?: number;
}

export default function PropertyMapMapbox({
  properties,
  center = [39.8283, -98.5795],
  zoom = 4,
  height = "400px",
  onPropertyClick,
  selectedPropertyId,
}: PropertyMapMapboxProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined;
  const mapRef = useRef<MapRef | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);
  const [ready, setReady] = useState(false);

  // Basic validation of coordinates
  const validProps = useMemo(
    () =>
      properties.filter(
        (p) =>
          typeof p.latitude === "number" &&
          typeof p.longitude === "number" &&
          !Number.isNaN(p.latitude) &&
          !Number.isNaN(p.longitude) &&
          p.latitude >= -90 &&
          p.latitude <= 90 &&
          p.longitude >= -180 &&
          p.longitude <= 180
      ),
    [properties]
  );

  useEffect(() => {
    if (!selected && selectedPropertyId) {
      const found = properties.find((p) => p.id === selectedPropertyId) || null;
      setSelected(found);
    }
  }, [properties, selected, selectedPropertyId]);

  const fitToProperties = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (validProps.length === 0) {
      map.easeTo({ center: [center[1], center[0]], zoom });
      return;
    }

    if (validProps.length === 1) {
      const p = validProps[0];
      map.easeTo({
        center: [p.longitude, p.latitude],
        zoom: Math.max(12, zoom),
      });
      return;
    }

    const bounds = new (mapboxgl as any).LngLatBounds();
    validProps.forEach((p) => bounds.extend([p.longitude, p.latitude]));
    map.fitBounds(bounds, { padding: 40, duration: 800 });
  }, [validProps, center, zoom]);

  useEffect(() => {
    if (ready) fitToProperties();
  }, [ready, fitToProperties, validProps.length]);

  if (!token) {
    return (
      <div
        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-yellow-700 dark:text-yellow-300 text-center p-4">
          <p className="font-medium">Mapbox token missing</p>
          <p className="text-sm">
            Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment to use the Mapbox
            map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <Map
        ref={mapRef}
        onLoad={() => setReady(true)}
        mapboxAccessToken={token}
        initialViewState={{ longitude: center[1], latitude: center[0], zoom }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {validProps.map((p) => (
          <Marker
            key={p.id}
            longitude={p.longitude}
            latitude={p.latitude}
            anchor="bottom"
          >
            <button
              aria-label={`View ${p.title}`}
              onClick={() => {
                setSelected(p);
                onPropertyClick?.(p);
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transform: "translateY(6px)",
              }}
              title={p.title}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="#2563eb"
                />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            closeOnClick={false}
            onClose={() => setSelected(null)}
            maxWidth="320px"
          >
            <div style={{ minWidth: 250 }}>
              <PopupCard property={selected} />
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
