import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import SearchFilter from "@/components/SearchFilter";
import { usePropertiesMap } from "@/hooks/usePropertiesMap";
import { useRouter } from "next/router";

// Dynamically import PropertyMapSimple to avoid SSR issues with Leaflet
const PropertyMapSimple = dynamic(
  () => import("@/components/PropertyMapSimple"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex justify-center items-center"
        style={{ height: "600px" }}
      >
        <div className="text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading map...
        </div>
      </div>
    ),
  }
);

export default function PropertiesMapPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { properties, loading, error, refetch } = usePropertiesMap({
    filters,
    autoFetch: true,
  });

  const handleSearch = (searchFilters: Record<string, any>) => {
    setFilters(searchFilters);
    refetch(searchFilters);
  };

  const handlePropertyClick = (property: any) => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <Layout>
      <Head>
        <title>Properties Map - DreamDwelling</title>
        <meta
          name="description"
          content="Explore properties on an interactive map"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Properties Map
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Explore properties in your area with our interactive map
            </p>
          </div>

          {/* Simple Filter for Map */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="Any"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      min_price: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Any"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      max_price: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bedrooms
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bedrooms: e.target.value,
                    }))
                  }
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => handleSearch(filters)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Map
                </button>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Property Locations
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {loading
                  ? "Loading..."
                  : `${properties.length} properties found`}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Loading map data...
                </span>
              </div>
            ) : (
              <PropertyMapSimple
                properties={properties}
                height="600px"
                onPropertyClick={handlePropertyClick}
              />
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
              Map Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Available Properties
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Selected Property
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Click marker for details
                </span>
              </div>
            </div>
          </div>

          {/* Properties Summary */}
          {properties.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Price Range
                </h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  $
                  {Math.min(...properties.map((p) => p.price)).toLocaleString()}{" "}
                  - $
                  {Math.max(...properties.map((p) => p.price)).toLocaleString()}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Property Types
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {Array.from(
                    new Set(properties.map((p) => p.property_type))
                  ).join(", ")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Average Size
                </h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(
                    properties.reduce((sum, p) => sum + p.square_feet, 0) /
                      properties.length
                  ).toLocaleString()}{" "}
                  sq ft
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
