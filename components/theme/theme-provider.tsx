"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "house-of-bee-theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in the root layout has already set the correct
  // class before hydration. We start on "light" and sync in an effect,
  // so the server and client markup always match.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");

    // Enable the theme fade only after the first paint.
    const frame = requestAnimationFrame(() => {
      document.documentElement.classList.add("theme-ready");
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The theme still changes for this visit if storage is blocked.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>.");
  }

  return context;
}