"use client";

import { useSlideEditorContext } from "@/slides/ctx/use-slide-editor";
import { layouts, type SlideLayout } from "@/slides/layouts";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LayoutDropdown() {
  const { editor } = useSlideEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<SlideLayout>(layouts[0]);
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

  const handleSelectLayout = (layout: SlideLayout) => {
    if (!editor) return;

    editor.commands.setContent({
      type: "doc",
      content: layout.content,
    });

    setCurrentLayout(layout);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <LayoutGrid className="h-3 w-3" />
        <span>{currentLayout.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-96 rounded-md border border-border bg-popover p-1 shadow-lg overflow-y-auto max-h-[60vh]">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => handleSelectLayout(layout)}
              className={`flex w-full flex-col items-start gap-0.5 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                currentLayout.id === layout.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">{layout.name}</span>
                {currentLayout.id === layout.id && (
                  <span className="text-xs text-muted-foreground">Active</span>
                )}
              </div>
              {layout.description && (
                <span className="text-xs text-muted-foreground">
                  {layout.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
