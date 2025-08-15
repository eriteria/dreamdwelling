import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface Property {
  id: number;
  title: string;
  description: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  price: number;
  price_per_sqft?: number;
  monthly_rent?: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size?: number;
  year_built?: number;
  parking_spaces?: number;
  property_type: number;
  property_type_name: string;
  status: "available" | "pending" | "sold" | "off_market";
  listing_type: "sale" | "rent" | "both";
  features: number[];
  has_air_conditioning: boolean;
  has_heating: boolean;
  pets_allowed: boolean;
  furnished: boolean;
  views_count: number;
  favorites_count: number;
  created_at: string;
  images: PropertyImage[];
  primary_image?: string;
  listed_by: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_agent: boolean;
  };
}

interface PropertyImage {
  id: number;
  image: string;
  caption: string;
  is_primary: boolean;
  order: number;
}

interface PropertiesState {
  properties: Property[];
  featuredProperties: Property[];
  property: Property | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  hasMore: boolean;
}

// Initial state
const initialState: PropertiesState = {
  properties: [],
  featuredProperties: [],
  property: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  page: 1,
  hasMore: false,
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (
    params: { page?: number; filters?: any } = {},
    { rejectWithValue }
  ) => {
    try {
      const page = params.page || 1;
      const filters = params.filters || {};

      // Create URLSearchParams and only add non-empty values
      const queryParams = new URLSearchParams();

      // Add filters to query params, skipping empty values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      // Add page parameter
      queryParams.append("page", page.toString());

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/properties/?${queryParams.toString()}`
      );

      // Handle GeoJSON format response
      const data = response.data;
      let properties = [];

      console.log("Properties API response:", data);

      if (data.results && data.results.features) {
        // GeoJSON format - extract properties from features
        properties = data.results.features.map((feature: any) => {
          return {
            ...feature.properties,
            id: feature.id, // ID is at the top level of the feature
            location: feature.geometry,
          };
        });
      } else if (Array.isArray(data.results)) {
        // Standard pagination format
        properties = data.results;
        console.log("Using standard format, properties:", properties);
      }

      console.log("Final processed properties:", properties);

      return {
        properties,
        totalCount: data.count || 0,
        page,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to fetch properties" }
      );
    }
  }
);

export const fetchFeaturedProperties = createAsyncThunk(
  "properties/fetchFeaturedProperties",
  async (_, { rejectWithValue }) => {
    try {
      // Featured properties could be newest, most viewed, or have special flag
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/?ordering=-created_at&limit=6`
      );

      // Handle GeoJSON format response
      const data = response.data;
      let properties = [];

      if (data.results && data.results.features) {
        // GeoJSON format - extract properties from features
        properties = data.results.features.map((feature: any) => ({
          ...feature.properties,
          id: feature.id, // ID is at the top level of the feature
          location: feature.geometry,
        }));
      } else if (Array.isArray(data.results)) {
        // Standard pagination format
        properties = data.results;
      }

      return properties;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || {
          detail: "Failed to fetch featured properties",
        }
      );
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchPropertyById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${id}/`
      );

      console.log("Property API Response:", response.data);

      // Handle potential GeoJSON format
      const data = response.data;
      if (data.type === "Feature" && data.properties) {
        // GeoJSON format - extract properties and add location
        return {
          ...data.properties,
          id: data.id, // ID is at the top level of the feature
          location: data.geometry,
        };
      }

      // Standard format
      return data;
    } catch (error: any) {
      console.error("Property fetch error:", error);
      return rejectWithValue(
        error.response?.data || { detail: "Failed to fetch property" }
      );
    }
  }
);

// Redux slice
const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearProperty: (state) => {
      state.property = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProperties: (state) => {
      state.properties = [];
      state.page = 1;
      state.hasMore = false;
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          const { properties, totalCount, page } = action.payload;

          if (page === 1) {
            state.properties = properties;
          } else {
            state.properties = [...state.properties, ...properties];
          }

          state.totalCount = totalCount;
          state.page = page;
          state.hasMore = state.properties.length < totalCount;
        }
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch featured properties
      .addCase(fetchFeaturedProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeaturedProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.isLoading = false;
          state.featuredProperties = action.payload;
        }
      )
      .addCase(fetchFeaturedProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch property by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPropertyById.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.isLoading = false;
          state.property = action.payload;
        }
      )
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.property = null;
      });
  },
});

export const { clearProperty, clearError, resetProperties } =
  propertiesSlice.actions;

export default propertiesSlice.reducer;
