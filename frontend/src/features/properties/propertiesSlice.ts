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
  async (params: { page?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const queryParams = new URLSearchParams(params.filters);
      queryParams.append("page", page.toString());

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/properties/?${queryParams.toString()}`
      );

      // Handle GeoJSON format response
      const data = response.data;
      let properties = [];
      
      if (data.results && data.results.features) {
        // GeoJSON format - extract properties from features
        properties = data.results.features.map((feature: any) => ({
          ...feature.properties,
          id: feature.properties.id,
          location: feature.geometry,
        }));
      } else if (Array.isArray(data.results)) {
        // Standard pagination format
        properties = data.results;
      }

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
          id: feature.properties.id,
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to fetch property" }
      );
    }
  }
);

// Properties slice
export const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearProperty: (state) => {
      state.property = null;
    },
    resetProperties: (state) => {
      state.properties = [];
      state.page = 1;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.isLoading = false;

      // If it's the first page, replace all properties
      // Otherwise append to existing properties
      if (action.payload.page === 1) {
        state.properties = action.payload.properties;
      } else {
        state.properties = [...state.properties, ...action.payload.properties];
      }

      state.totalCount = action.payload.totalCount;
      state.page = action.payload.page;
      state.hasMore = state.properties.length < state.totalCount;
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      // Ensure properties remains an array even on error
      if (!Array.isArray(state.properties)) {
        state.properties = [];
      }
    });

    // Fetch featured properties
    builder.addCase(fetchFeaturedProperties.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeaturedProperties.fulfilled, (state, action) => {
      state.isLoading = false;
      state.featuredProperties = action.payload;
    });
    builder.addCase(fetchFeaturedProperties.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      // Ensure featuredProperties remains an array even on error
      if (!Array.isArray(state.featuredProperties)) {
        state.featuredProperties = [];
      }
    });

    // Fetch property by ID
    builder.addCase(fetchPropertyById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPropertyById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.property = action.payload;
    });
    builder.addCase(fetchPropertyById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProperty, resetProperties } = propertiesSlice.actions;

export default propertiesSlice.reducer;
