import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme from localStorage after hydration
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    setTheme(savedTheme || systemPreference);
    setIsHydrated(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!isHydrated) return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: handleSetTheme,
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until hydrated
  if (!isHydrated) {
    return (
      <ThemeContext.Provider
        value={{
          theme: "light", // Always use light theme during SSR to match initial state
          toggleTheme,
          setTheme: handleSetTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
