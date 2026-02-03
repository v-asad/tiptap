"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemePreview } from "./theme-preview";
import {
  type EditorTheme,
  type CustomEditorTheme,
  AVAILABLE_FONTS,
  DEFAULT_THEME,
} from "@/lib/themes";
import { fonts, loadFont } from "@/lib/fonts";

interface ThemeEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTheme?: CustomEditorTheme;
  onSave: (theme: Omit<EditorTheme, "name"> & { name: string }) => void;
  existingNames: string[];
}

export function ThemeEditorDialog({
  open,
  onOpenChange,
  editingTheme,
  onSave,
  existingNames,
}: ThemeEditorDialogProps) {
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#1f2937");
  const [linkColor, setLinkColor] = useState("#2563eb");
  const [titleFont, setTitleFont] = useState("'Inter', sans-serif");
  const [bodyFont, setBodyFont] = useState("'Inter', sans-serif");
  const [error, setError] = useState("");

  // Reset form when dialog opens/closes or editing theme changes
  useEffect(() => {
    if (open) {
      if (editingTheme) {
        // eslint-disable-next-line
        setName(editingTheme.name);
        setBgColor(editingTheme.bgColor);
        setSecondaryColor(editingTheme.secondaryColor);
        setTextColor(editingTheme.textColor);
        setLinkColor(editingTheme.linkColor);
        setTitleFont(editingTheme.titleFont);
        setBodyFont(editingTheme.bodyFont);
      } else {
        setName("");
        setBgColor(DEFAULT_THEME.bgColor);
        setSecondaryColor(DEFAULT_THEME.secondaryColor);
        setTextColor(DEFAULT_THEME.textColor);
        setLinkColor(DEFAULT_THEME.linkColor);
        setTitleFont(DEFAULT_THEME.titleFont);
        setBodyFont(DEFAULT_THEME.bodyFont);
      }
      setError("");
    }
  }, [open, editingTheme]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Theme name is required");
      return;
    }

    // Check for duplicate name (excluding current theme if editing)
    const isDuplicate = existingNames.some(
      (n) =>
        n.toLowerCase() === name.trim().toLowerCase() &&
        (!editingTheme || n !== editingTheme.name),
    );

    if (isDuplicate) {
      setError("A custom theme with this name already exists");
      return;
    }

    onSave({
      name: name.trim(),
      bgColor,
      secondaryColor,
      textColor,
      linkColor,
      titleFont,
      bodyFont,
    });
    onOpenChange(false);
  };

  const previewTheme = {
    bgColor,
    secondaryColor,
    textColor,
    linkColor,
    titleFont,
    bodyFont,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingTheme ? "Edit Theme" : "Create Custom Theme"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Theme Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Theme Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="My Custom Theme"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="bgColor"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Accent</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Text</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="textColor"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkColor">Links</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="linkColor"
                    value={linkColor}
                    onChange={(e) => setLinkColor(e.target.value)}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input
                    value={linkColor}
                    onChange={(e) => setLinkColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Fonts */}
            <div className="space-y-2">
              <Label htmlFor="titleFont">Title Font</Label>
              <Select
                value={titleFont}
                onValueChange={(value) => {
                  const font = fonts.find((f) => f.cssValue === value);
                  if (font) loadFont(font);
                  setTitleFont(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font, index) => (
                    <SelectItem
                      key={font.value}
                      value={font.value}
                      onMouseEnter={() => loadFont(fonts[index])}
                    >
                      <span style={{ fontFamily: font.value }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyFont">Body Font</Label>
              <Select
                value={bodyFont}
                onValueChange={(value) => {
                  const font = fonts.find((f) => f.cssValue === value);
                  if (font) loadFont(font);
                  setBodyFont(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font, index) => (
                    <SelectItem
                      key={font.value}
                      value={font.value}
                      onMouseEnter={() => loadFont(fonts[index])}
                    >
                      <span style={{ fontFamily: font.value }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <ThemePreview theme={previewTheme} className="h-full min-h-50" />
          </div>
        </div>

        <DialogFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingTheme ? "Save Changes" : "Create Theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
