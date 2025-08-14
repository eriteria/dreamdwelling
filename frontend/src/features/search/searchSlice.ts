import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface SearchLocation {
  display: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface SearchFilters {
  city?: string;
  state?: string;
  zip_code?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  property_type?: number;
  listing_type?: "sale" | "rent" | "both";
  has_air_conditioning?: boolean;
  has_heating?: boolean;
  pets_allowed?: boolean;
  furnished?: boolean;
  min_square_feet?: number;
  max_square_feet?: number;
  features?: number[];
  lat?: number;
  lng?: number;
  radius?: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface SearchState {
  filters: SearchFilters;
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;
  mapBounds: MapBounds | null;
  searchLocations: SearchLocation[];
  isSearching: boolean;
  error: string | null;
}

// Initial state
const initialState: SearchState = {
  filters: {},
  mapCenter: null,
  mapZoom: 12,
  mapBounds: null,
  searchLocations: [],
  isSearching: false,
  error: null,
};

// Async thunks
export const searchLocations = createAsyncThunk(
  "search/searchLocations",
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query || query.length < 2) return [];

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/search/autocomplete/?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to search locations" }
      );
    }
  }
);

// Search slice
export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setMapCenter: (
      state,
      action: PayloadAction<{ lat: number; lng: number }>
    ) => {
      state.mapCenter = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload;
    },
    setMapBounds: (state, action: PayloadAction<MapBounds>) => {
      state.mapBounds = action.payload;
    },
    clearSearchLocations: (state) => {
      state.searchLocations = [];
    },
  },
  extraReducers: (builder) => {
    // Search locations
    builder.addCase(searchLocations.pending, (state) => {
      state.isSearching = true;
      state.error = null;
    });
    builder.addCase(searchLocations.fulfilled, (state, action) => {
      state.isSearching = false;
      state.searchLocations = action.payload;
    });
    builder.addCase(searchLocations.rejected, (state, action) => {
      state.isSearching = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setFilters,
  clearFilters,
  setMapCenter,
  setMapZoom,
  setMapBounds,
  clearSearchLocations,
} = searchSlice.actions;

export default searchSlice.reducer;
