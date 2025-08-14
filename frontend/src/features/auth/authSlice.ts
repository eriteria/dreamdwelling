import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  bio: string | null;
  profile_picture: string | null;
  email_notifications: boolean;
  is_agent: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | { detail: string } | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: Cookies.get("token") || null,
  isAuthenticated: !!Cookies.get("token"),
  isLoading: false,
  error: null,
};

// Set initial auth header if token exists
if (initialState.token) {
  axios.defaults.headers.common["Authorization"] = `JWT ${initialState.token}`;
}

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Login attempt:", {
        email,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/create/`,
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);
      const { access, refresh } = response.data;

      // Store tokens in cookies
      Cookies.set("token", access, { expires: 1 }); // 1 day
      Cookies.set("refresh", refresh, { expires: 7 }); // 7 days

      // Set default auth header for future requests
      axios.defaults.headers.common["Authorization"] = `JWT ${access}`;

      // Get user profile
      console.log("Fetching user profile...");
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/`
      );

      console.log("User profile response:", userResponse.data);

      return {
        token: access,
        user: userResponse.data,
      };
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { detail: "Login failed" }
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      email: string;
      password: string;
      re_password: string;
      first_name: string;
      last_name: string;
      phone_number?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/users/`,
        userData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Registration failed" }
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      console.log("fetchUser - Current state:", {
        hasToken: !!state.auth.token,
        isAuthenticated: state.auth.isAuthenticated,
      });

      if (!state.auth.token) {
        return rejectWithValue("No authentication token");
      }

      console.log("fetchUser - Making API call with token...");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/`
      );

      console.log("fetchUser - Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "fetchUser - Error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { detail: "Failed to fetch user" }
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  // Clear tokens
  Cookies.remove("token");
  Cookies.remove("refresh");

  // Clear auth header
  delete axios.defaults.headers.common["Authorization"];

  return null;
});

// Auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      Cookies.set("token", action.payload, { expires: 1 });
      axios.defaults.headers.common["Authorization"] = `JWT ${action.payload}`;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove("token");
      Cookies.remove("refresh");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string | { detail: string };
    });

    // Registration
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
      // Registration successful, but user still needs to login
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string | { detail: string };
    });

    // Fetch user
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string | { detail: string };
      // If we can't fetch the user, we're not authenticated
      if (
        action.payload === "No authentication token" ||
        (typeof action.payload === "object" &&
          action.payload &&
          "detail" in action.payload &&
          action.payload.detail === "Invalid token")
      ) {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      }
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { setAuthToken, clearAuth } = authSlice.actions;

export default authSlice.reducer;
