import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  addFavorite,
  removeFavorite,
} from "@/features/favorites/favoritesSlice";
import { Property } from "@/features/properties/propertiesSlice";

interface PropertyCardProps {
  property: Property;
  /**
   * When true, mark this card's image as high priority (Next/Image LCP hint).
   * Use sparingly (e.g., only the first visible card) to avoid fetchPriority warnings.
   */
  priority?: boolean;
}

export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.favorites);
  const dispatch = useAppDispatch();

  const isFavorite = favorites.some((fav) => fav.id === property.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("toggleFavorite called for property:", property.id);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isFavorite:", isFavorite);

    if (!isAuthenticated) {
      console.log("User not authenticated, should redirect to login");
      // Redirect to login or show login modal
      return;
    }

    if (isFavorite) {
      console.log("Removing favorite for property:", property.id);
      dispatch(removeFavorite(property.id));
    } else {
      console.log("Adding favorite for property:", property.id);
      dispatch(addFavorite(property.id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-900/70"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48 w-full">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0].image}
              alt={`${property.title}`}
              fill
              className="object-cover"
              unoptimized
              priority={priority}
            />
          ) : property.primary_image ? (
            <Image
              src={property.primary_image}
              alt={`${property.title}`}
              fill
              className="object-cover"
              unoptimized
              priority={priority}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">
                No image available
              </span>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:scale-110"
          >
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>

          {/* Property status tag */}
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {property.listing_type === "sale" ? "FOR SALE" : "FOR RENT"}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 line-clamp-1 transition-colors duration-200">
              {property.title}
            </h3>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 transition-colors duration-200">
            {property.address_line1}, {property.city}, {property.state}{" "}
            {property.zip_code}
          </p>

          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-200">
            {formatPrice(property.price)}
            {property.listing_type === "rent" && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                /month
              </span>
            )}
          </p>

          <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm transition-colors duration-200">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>
                {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
              </span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "bath" : "baths"}
              </span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              <span>{property.square_feet} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
