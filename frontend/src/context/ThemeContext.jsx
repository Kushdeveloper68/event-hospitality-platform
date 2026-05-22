import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { updateTheme as apiUpdateTheme } from "../api/organizationSettingApi";

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext({
  theme: "light",          // stored preference: "light" | "dark" | "system"
  resolvedTheme: "light",  // actual applied theme: "light" | "dark"
  setTheme: () => {},
  toggleTheme: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  // 1. Read persisted preference (localStorage → fallback "light")
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("app-theme") || "light";
  });

  // 2. Resolve the actual applied theme
  const getResolvedTheme = useCallback((pref) => {
    if (pref === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return pref;
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getResolvedTheme(localStorage.getItem("app-theme") || "light")
  );

  // 3. Apply theme to <html> element
  const applyTheme = useCallback(
    (pref) => {
      const resolved = getResolvedTheme(pref);
      setResolvedTheme(resolved);
      const root = document.documentElement;
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },
    [getResolvedTheme]
  );

  // 4. On mount: apply stored theme + listen for system changes
  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, applyTheme]);

  // 5. Public setter — persists to localStorage + DB (fire-and-forget)
  const setTheme = useCallback(
    async (newTheme) => {
      if (!["light", "dark", "system"].includes(newTheme)) return;
      localStorage.setItem("app-theme", newTheme);
      setThemeState(newTheme);
      applyTheme(newTheme);
      // Sync to backend silently — don't block UI
      try {
        await apiUpdateTheme(newTheme);
      } catch (_) {
        // non-critical — preference already saved locally
      }
    },
    [applyTheme]
  );

  // 6. Quick toggle: light ↔ dark (skips "system")
  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTheme = () => useContext(ThemeContext);