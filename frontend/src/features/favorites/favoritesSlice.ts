import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
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
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/`,
        { property: propertyId },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
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
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${propertyId}/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
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
    });

    // Add favorite
    builder.addCase(
      addFavorite.fulfilled,
      (state, action: PayloadAction<Property>) => {
        state.favorites.push(action.payload);
      }
    );
    builder.addCase(addFavorite.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Remove favorite
    builder.addCase(
      removeFavorite.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.favorites = state.favorites.filter(
          (favorite) => favorite.id !== action.payload
        );
      }
    );
    builder.addCase(removeFavorite.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
