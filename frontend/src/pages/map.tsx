import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/components/Layout";
import PropertyMapMapbox from "@/components/PropertyMapMapbox";
import { usePropertiesMap } from "@/hooks/usePropertiesMap";

export default function MapPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const { properties, loading, error } = usePropertiesMap({ filters });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
    });
  };

  return (
    <Layout>
      <Head>
        <title>Property Map - DreamDwelling</title>
        <meta
          name="description"
          content="Explore properties on an interactive map"
        />
      </Head>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Property Map
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                  Discover properties in your area with our interactive map
                </p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Map engine selector removed; Mapbox is enforced */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  placeholder="City, State, or ZIP"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) =>
                    handleFilterChange("propertyType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) =>
                    handleFilterChange("bedrooms", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) =>
                    handleFilterChange("bathrooms", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
              >
                Clear Filters
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {loading
                  ? "Loading..."
                  : `${properties.length} properties found`}
              </div>
            </div>

            {/* Debug Section - Remove in production */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Loading: {loading.toString()}</p>
              <p>Error: {error || "None"}</p>
              <p>Properties count: {properties.length}</p>
              <p>
                API URL: {process.env.NEXT_PUBLIC_API_URL}/properties/map_data/
              </p>
              {properties.length > 0 && (
                <p>Sample property: {JSON.stringify(properties[0], null, 2)}</p>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
            {error ? (
              <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                  <p>Error loading properties: {error}</p>
                </div>
              </div>
            ) : loading ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "600px" }}
              >
                <div className="text-gray-600 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  Loading map data...
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "600px" }}
              >
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>No properties found with the current filters</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search criteria
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ height: "600px" }}>
                <PropertyMapMapbox properties={properties} />
              </div>
            )}
          </div>

          {/* Property Statistics */}
          {!loading && !error && properties.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Quick Stats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {properties.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Properties
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    $
                    {properties.length > 0
                      ? Math.round(
                          properties.reduce((sum, p) => sum + p.price, 0) /
                            properties.length
                        ).toLocaleString()
                      : 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Price
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {properties.filter((p) => p.status === "available").length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Available Now
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Map Legend
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Available Properties
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Properties
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Sold Properties
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
