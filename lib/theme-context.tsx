"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type EditorTheme, themes, DEFAULT_THEME } from "./themes";

interface ThemeContextValue {
  theme: EditorTheme;
  setTheme: (theme: EditorTheme) => void;
  setThemeByName: (name: string) => void;
  availableThemes: EditorTheme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useEditorTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useEditorTheme must be used within an EditorThemeProvider");
  }
  return context;
}

interface EditorThemeProviderProps {
  children: ReactNode;
  defaultTheme?: EditorTheme;
}

export function EditorThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: EditorThemeProviderProps) {
  const [theme, setThemeState] = useState<EditorTheme>(defaultTheme);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--editor-bg", theme.bgColor);
    root.style.setProperty("--editor-secondary", theme.secondaryColor);
    root.style.setProperty("--editor-text", theme.textColor);
    root.style.setProperty("--editor-link", theme.linkColor);
    root.style.setProperty("--editor-title-font", theme.titleFont);
    root.style.setProperty("--editor-body-font", theme.bodyFont);
  }, [theme]);

  const setTheme = useCallback((newTheme: EditorTheme) => {
    setThemeState(newTheme);
  }, []);

  const setThemeByName = useCallback((name: string) => {
    const found = themes.find((t) => t.name === name);
    if (found) {
      setThemeState(found);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        setThemeByName,
        availableThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
