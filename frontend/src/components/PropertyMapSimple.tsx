import { useEffect, useState } from "react";

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

export default function PropertyMapSimple({
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
    <div
      className="rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800"
      style={{ height }}
    >
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Map Loading...
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {properties.length} properties found
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {properties.slice(0, 10).map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onPropertyClick?.(property)}
              >
                <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                  {property.title}
                </h3>
                <p className="text-lg font-bold text-blue-600 mb-1">
                  {formatPrice(property.price)}
                  {property.listing_type === "rent" && "/month"}
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                  {property.address}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    property.status === "available"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : property.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {property.status.charAt(0).toUpperCase() +
                    property.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
          {properties.length > 10 && (
            <div className="text-sm text-gray-500 mt-4">
              Showing first 10 of {properties.length} properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
