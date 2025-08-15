import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { Property } from "../properties/propertiesSlice";

// Types
interface FavoriteState {
  favorites: Property[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/properties/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      // Handle different response structures
      let favoritesData = response.data;

      // If response has a results property (paginated), use that
      if (response.data.results && Array.isArray(response.data.results)) {
        favoritesData = response.data.results;
      } else if (!Array.isArray(response.data)) {
        // If response.data is not an array, it might be a paginated response
        // Let's check for common pagination patterns
        if (Array.isArray(response.data.data)) {
          favoritesData = response.data.data;
        } else if (Array.isArray(response.data.items)) {
          favoritesData = response.data.items;
        } else {
          return [];
        }
      }

      // If response.data is not an array, wrap it or return empty array
      if (!Array.isArray(favoritesData)) {
        return [];
      }

      // Extract property details from the favorites response
      const mappedFavorites = favoritesData.map((favorite: any) => {
        // The property_details contains a GeoJSON-like structure where
        // the actual property data is in the 'properties' field
        const propertyDetails = favorite.property_details;
        if (propertyDetails && propertyDetails.properties) {
          // Flatten the structure by combining id with properties content
          return {
            id: propertyDetails.id,
            ...propertyDetails.properties,
            // Keep other fields that might be useful
            images: propertyDetails.properties.images || [],
            primary_image: propertyDetails.properties.primary_image,
          };
        } else {
          // Fallback if structure is different
          return propertyDetails;
        }
      });

      return mappedFavorites;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to fetch favorites" }
      );
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/properties/`,
        { property: propertyId },
        {
          headers: {
            Authorization: `JWT ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Return the property details from the favorite response
      return response.data.property_details;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to add favorite" }
      );
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/properties/property/${propertyId}/`,
        {
          headers: {
            Authorization: `JWT ${Cookies.get("token")}`,
          },
        }
      );
      return propertyId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to remove favorite" }
      );
    }
  }
);

// Favorites slice
export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch favorites
    builder.addCase(fetchFavorites.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchFavorites.fulfilled,
      (state, action: PayloadAction<Property[]>) => {
        state.loading = false;
        state.favorites = action.payload;
      }
    );
    builder.addCase(fetchFavorites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      console.error("Failed to fetch favorites:", action.payload);
    });

    // Add favorite
    builder.addCase(addFavorite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addFavorite.fulfilled,
      (state, action: PayloadAction<Property>) => {
        state.loading = false;
        state.favorites.push(action.payload);
      }
    );
    builder.addCase(addFavorite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove favorite
    builder.addCase(removeFavorite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      removeFavorite.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.favorites = state.favorites.filter(
          (favorite) => favorite.id !== action.payload
        );
      }
    );
    builder.addCase(removeFavorite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
