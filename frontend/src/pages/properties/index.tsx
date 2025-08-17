import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import SearchFilter from "@/components/SearchFilter";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchProperties } from "@/features/properties/propertiesSlice";

// Dynamically import Mapbox map to avoid SSR issues
const PropertyMapMapbox = dynamic(
  () => import("@/components/PropertyMapMapbox"),
  {
  ssr: false,
  loading: () => (
    <div
      className="flex justify-center items-center"
      style={{ height: "400px" }}
    >
      <div className="text-gray-600 dark:text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        Loading map...
      </div>
    </div>
  ),
  }
);

// Transform property data for map component
const transformPropertyForMap = (property: any) => ({
  id: property.id,
  title: property.title,
  price: property.price,
  latitude: property.location?.coordinates?.[1] || 0,
  longitude: property.location?.coordinates?.[0] || 0,
  address: `${property.address_line1}, ${property.city}, ${property.state}`,
  property_type: property.property_type_name,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  square_feet: property.square_feet,
  listing_type: property.listing_type,
  primary_image: property.primary_image,
  status: property.status,
});

export default function PropertiesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    properties = [],
    isLoading,
    error,
  } = useAppSelector((state) => state.properties);
  const { filters } = useAppSelector((state) => state.search);

  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch properties when filters or sort option changes
  useEffect(() => {
    const fetchParams = {
      filters: {
        ...filters,
        ordering: getSortOrdering(sortBy),
      },
    };
    dispatch(fetchProperties(fetchParams));
  }, [dispatch, filters, sortBy]);

  // Get the API ordering parameter based on the sort option
  const getSortOrdering = (sort: string) => {
    switch (sort) {
      case "price_low":
        return "price";
      case "price_high":
        return "-price";
      case "newest":
        return "-created_at";
      case "oldest":
        return "created_at";
      default:
        return "-created_at";
    }
  };

  return (
    <Layout>
      <Head>
        <title>Properties | DreamDwelling</title>
        <meta
          name="description"
          content="Browse through our extensive collection of properties for sale and rent."
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-300">
          Find Your Perfect Property
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <SearchFilter />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0 transition-colors duration-300">
                Showing{" "}
                <span className="font-semibold">{properties?.length || 0}</span>{" "}
                properties
              </p>

              <div className="flex items-center space-x-4">
                {/* View mode toggle */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors duration-300 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Grid view</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">List view</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors duration-300 ${
                      viewMode === "map"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Map view</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Sort dropdown */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="spinner-border text-blue-600" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md transition-colors duration-300">
                <p>Error loading properties. Please try again later.</p>
              </div>
            ) : !Array.isArray(properties) || properties.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg text-center transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  No properties found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Try adjusting your filters to find more properties.
                </p>
              </div>
            ) : viewMode === "map" ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <PropertyMapMapbox
                  properties={properties.map(transformPropertyForMap)}
                  height="600px"
                />
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {Array.isArray(properties) &&
                  properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
