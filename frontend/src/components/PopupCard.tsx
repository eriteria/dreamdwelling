import Image from "next/image";

export interface Property {
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

export default PopupCard;
