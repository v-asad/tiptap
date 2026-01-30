"use client";

import { useEditorTheme } from "@/lib/theme-context";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ThemeDropdown() {
  const { theme, setTheme, availableThemes } = useEditorTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span
          className="h-3 w-3 rounded-full border border-border"
          style={{ backgroundColor: theme.bgColor }}
        />
        <span>{theme.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
          {availableThemes.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                setTheme(t);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                theme.name === t.name ? "bg-accent" : ""
              }`}
            >
              <span
                className="h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: t.bgColor }}
              />
              <span>{t.name}</span>
              {theme.name === t.name && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
