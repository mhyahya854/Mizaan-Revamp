import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "night" | "system";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: "light" | "dark" | "night";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mizaan-theme");
      if (stored === "light" || stored === "dark" || stored === "night" || stored === "system") {
        return stored;
      }
      return "system";
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark" | "night">("light");

  const setTheme = (newTheme: Theme) => {
    if (
      newTheme !== "light" &&
      newTheme !== "dark" &&
      newTheme !== "night" &&
      newTheme !== "system"
    ) {
      newTheme = "system";
    }
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("mizaan-theme", newTheme);
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      let active: "light" | "dark" | "night" = "light";

      if (theme === "system") {
        active = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        active = theme;
      }

      root.setAttribute("data-theme", active);

      // Support legacy .dark class if components still rely on it
      if (active === "dark") {
        root.classList.add("dark");
        root.classList.remove("night");
      } else if (active === "night") {
        root.classList.add("night");
        root.classList.remove("dark");
      } else {
        root.classList.remove("dark", "night");
      }

      setResolvedTheme(active);
    };

    updateTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => updateTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
