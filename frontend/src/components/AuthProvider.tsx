import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchUser } from "@/features/auth/authSlice";
import { fetchFavorites } from "@/features/favorites/favoritesSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run after hydration to avoid SSR mismatch
    if (!isHydrated) return;

    // If we have a token but no user data, fetch the user
    if (token && !user && isAuthenticated) {
      dispatch(fetchUser());
    }

    // If user is authenticated, fetch their favorites
    if (isAuthenticated && token) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, token, user, isAuthenticated, isHydrated]);

  return <>{children}</>;
}
