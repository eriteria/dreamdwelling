import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

// Custom icon for selected property
const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fit map bounds to all properties
function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((property) => [property.latitude, property.longitude])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, properties]);

  return null;
}

export default function PropertyMap({
  properties,
  center = [39.8283, -98.5795], // Center of USA
  zoom = 4,
  height = "400px",
  onPropertyClick,
  selectedPropertyId,
}: PropertyMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-300"
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.length > 0 && <FitBounds properties={properties} />}

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={selectedPropertyId === property.id ? selectedIcon : undefined}
            eventHandlers={{
              click: () => onPropertyClick?.(property),
            }}
          >
            <Popup>
              <div className="min-w-[250px]">
                {property.primary_image && (
                  <Image
                    src={property.primary_image}
                    alt={property.title}
                    width={320}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {formatPrice(property.price)}
                  {property.listing_type === "rent" && "/month"}
                </p>
                <div className="text-sm text-gray-600 mb-2">
                  <p>
                    {property.bedrooms} bed • {property.bathrooms} bath •{" "}
                    {property.square_feet.toLocaleString()} sq ft
                  </p>
                  <p className="capitalize">{property.property_type}</p>
                </div>
                <p className="text-sm text-gray-500">{property.address}</p>
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === "available"
                        ? "bg-green-100 text-green-800"
                        : property.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {property.status.charAt(0).toUpperCase() +
                      property.status.slice(1)}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
