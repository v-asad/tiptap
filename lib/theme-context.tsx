"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type EditorTheme,
  type CustomEditorTheme,
  themes,
  DEFAULT_THEME,
} from "./themes";
import { useCustomThemes } from "./use-custom-themes";

interface ThemeContextValue {
  theme: EditorTheme | CustomEditorTheme;
  setTheme: (theme: EditorTheme | CustomEditorTheme) => void;
  setThemeByName: (name: string) => void;
  availableThemes: EditorTheme[];
  customThemes: CustomEditorTheme[];
  addCustomTheme: (
    theme: Omit<EditorTheme, "name"> & { name: string }
  ) => CustomEditorTheme;
  updateCustomTheme: (id: string, updates: Partial<EditorTheme>) => void;
  deleteCustomTheme: (id: string) => void;
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
  const [theme, setThemeState] = useState<EditorTheme | CustomEditorTheme>(
    defaultTheme
  );
  const {
    customThemes,
    addTheme,
    updateTheme,
    deleteTheme,
  } = useCustomThemes();

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

  const setTheme = useCallback(
    (newTheme: EditorTheme | CustomEditorTheme) => {
      setThemeState(newTheme);
    },
    []
  );

  const setThemeByName = useCallback(
    (name: string) => {
      const found =
        themes.find((t) => t.name === name) ||
        customThemes.find((t) => t.name === name);
      if (found) {
        setThemeState(found);
      }
    },
    [customThemes]
  );

  const addCustomTheme = useCallback(
    (themeData: Omit<EditorTheme, "name"> & { name: string }) => {
      return addTheme(themeData);
    },
    [addTheme]
  );

  const updateCustomTheme = useCallback(
    (id: string, updates: Partial<EditorTheme>) => {
      updateTheme(id, updates);
      // If updating the currently active theme, refresh it
      if ("id" in theme && theme.id === id) {
        setThemeState((prev) => ({ ...prev, ...updates }));
      }
    },
    [updateTheme, theme]
  );

  const deleteCustomTheme = useCallback(
    (id: string) => {
      deleteTheme(id);
      // If deleting the currently active theme, switch to default
      if ("id" in theme && theme.id === id) {
        setThemeState(DEFAULT_THEME);
      }
    },
    [deleteTheme, theme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        setThemeByName,
        availableThemes: themes,
        customThemes,
        addCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
