import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "../features/auth/authSlice";
import propertiesReducer from "../features/properties/propertiesSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import searchReducer from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    favorites: favoritesReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as they may contain non-serializable values
        ignoredActions: [
          "auth/register/fulfilled",
          "auth/login/fulfilled",
          "auth/loadUser/fulfilled",
        ],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
