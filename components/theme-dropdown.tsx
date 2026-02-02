"use client";

import { useEditorTheme } from "@/lib/theme-context";
import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeEditorDialog } from "./theme-editor-dialog";
import { DeleteThemeDialog } from "./delete-theme-dialog";
import type { CustomEditorTheme, EditorTheme } from "@/lib/themes";

export function ThemeDropdown() {
  const {
    theme,
    setTheme,
    availableThemes,
    customThemes,
    addCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
  } = useEditorTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Editor dialog state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<
    CustomEditorTheme | undefined
  >(undefined);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<
    CustomEditorTheme | undefined
  >(undefined);

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

  const handleCreateTheme = () => {
    setEditingTheme(undefined);
    setEditorOpen(true);
    setIsOpen(false);
  };

  const handleEditTheme = (t: CustomEditorTheme) => {
    setEditingTheme(t);
    setEditorOpen(true);
    setIsOpen(false);
  };

  const handleDeleteClick = (t: CustomEditorTheme) => {
    setThemeToDelete(t);
    setDeleteOpen(true);
  };

  const handleSaveTheme = (
    themeData: Omit<EditorTheme, "name"> & { name: string }
  ) => {
    if (editingTheme) {
      updateCustomTheme(editingTheme.id, themeData);
    } else {
      const newTheme = addCustomTheme(themeData);
      setTheme(newTheme);
    }
  };

  const handleConfirmDelete = () => {
    if (themeToDelete) {
      deleteCustomTheme(themeToDelete.id);
      setThemeToDelete(undefined);
    }
  };

  const isCustomTheme = (t: EditorTheme | CustomEditorTheme): t is CustomEditorTheme => {
    return "isCustom" in t && t.isCustom === true;
  };

  const isActiveTheme = (t: EditorTheme | CustomEditorTheme) => {
    if (isCustomTheme(t) && isCustomTheme(theme)) {
      return t.id === theme.id;
    }
    return t.name === theme.name;
  };

  return (
    <>
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
          <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
            {/* Preset Themes Section */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Preset Themes
            </div>
            {availableThemes.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => {
                  setTheme(t);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActiveTheme(t) ? "bg-accent" : ""
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: t.bgColor }}
                />
                <span className="flex-1 text-left">{t.name}</span>
                {isActiveTheme(t) && (
                  <span className="text-xs text-muted-foreground">Active</span>
                )}
              </button>
            ))}

            {/* Custom Themes Section */}
            {customThemes.length > 0 && (
              <>
                <div className="my-1 border-t" />
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Custom Themes
                </div>
                {customThemes.map((t) => (
                  <div
                    key={t.id}
                    className={`group flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActiveTheme(t) ? "bg-accent" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setTheme(t);
                        setIsOpen(false);
                      }}
                      className="flex flex-1 items-center gap-2"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: t.bgColor }}
                      />
                      <span className="flex-1 text-left">{t.name}</span>
                      {isActiveTheme(t) && (
                        <span className="text-xs text-muted-foreground">
                          Active
                        </span>
                      )}
                    </button>
                    <div className="hidden gap-1 group-hover:flex">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTheme(t);
                        }}
                        className="rounded p-0.5 hover:bg-muted"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(t);
                        }}
                        className="rounded p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Create Theme Button */}
            <div className="my-1 border-t" />
            <button
              type="button"
              onClick={handleCreateTheme}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="h-3 w-3" />
              <span>Create Custom Theme</span>
            </button>
          </div>
        )}
      </div>

      {/* Theme Editor Dialog */}
      <ThemeEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingTheme={editingTheme}
        onSave={handleSaveTheme}
        existingNames={customThemes.map((t) => t.name)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteThemeDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        themeName={themeToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
