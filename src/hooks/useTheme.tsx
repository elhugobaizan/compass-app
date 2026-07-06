import { createContext, useContext, useEffect, useState, type ReactNode, type JSX } from "react";
import { DEFAULT_THEME, isTheme, type ThemeId } from "@/config/themes";

const STORAGE_KEY = "compass-theme";

type ThemeContextValue = {
  readonly theme: ThemeId;
  readonly setTheme: (theme: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ThemeId {
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
  return isTheme(stored) ? stored : DEFAULT_THEME;
}

export function ThemeProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<ThemeId>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    globalThis.localStorage?.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
