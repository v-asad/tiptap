"use client";

import { useState, useEffect, useCallback } from "react";
import type { CustomEditorTheme, EditorTheme } from "./themes";

const STORAGE_KEY = "slide-editor-custom-themes";

export function useCustomThemes() {
  const [customThemes, setCustomThemes] = useState<CustomEditorTheme[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line
        setCustomThemes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load custom themes:", e);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customThemes));
    }
  }, [customThemes, isLoaded]);

  const addTheme = useCallback(
    (theme: Omit<EditorTheme, "name"> & { name: string }) => {
      const newTheme: CustomEditorTheme = {
        ...theme,
        id: crypto.randomUUID(),
        isCustom: true,
      };
      setCustomThemes((prev) => [...prev, newTheme]);
      return newTheme;
    },
    []
  );

  const updateTheme = useCallback(
    (id: string, updates: Partial<EditorTheme>) => {
      setCustomThemes((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTheme = useCallback((id: string) => {
    setCustomThemes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { customThemes, addTheme, updateTheme, deleteTheme, isLoaded };
}
