import { useState, useEffect, useCallback } from "react";
import axios from "axios";

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

interface UsePropertiesMapParams {
  filters?: Record<string, any>;
  autoFetch?: boolean;
}

export function usePropertiesMap({
  filters = {},
  autoFetch = true,
}: UsePropertiesMapParams = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  // We intentionally depend on a stable stringified key to avoid reference churn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMapData = useCallback(
    async (customFilters?: Record<string, any>) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const appliedFilters = { ...filters, ...customFilters };

        // Add filters to params
        Object.entries(appliedFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/properties/map_data/?${params.toString()}`
        );
        setProperties(response.data);
      } catch (err) {
        console.error("Error fetching map data:", err);
        setError("Failed to load map data");
      } finally {
        setLoading(false);
      }
    },
    [filtersKey]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchMapData();
    }
  }, [autoFetch, fetchMapData]);

  return {
    properties,
    loading,
    error,
    refetch: fetchMapData,
  };
}
