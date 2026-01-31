"use client";

import { useSlideEditorContext } from "@/slides/ctx/use-slide-editor";
import { layoutCategories, layouts, type SlideLayout } from "@/slides/layouts";
import { LayoutGrid, ImageIcon, Type, Maximize } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  text: <Type className="size-4" />,
  image: <ImageIcon className="size-4" />,
  "full-image": <Maximize className="size-4" />,
};

export function LayoutDropdown() {
  const { editor } = useSlideEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<SlideLayout>(layouts[0]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <LayoutGrid className="h-3 w-3" />
          <span>{currentLayout.name}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Layout</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {layoutCategories.map((category) => (
            <div key={category.id} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                {categoryIcons[category.id]}
                <span>{category.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {category.layouts.map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => handleSelectLayout(layout)}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      currentLayout.id === layout.id
                        ? "border-primary bg-accent"
                        : "border-border"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{layout.name}</span>
                      {currentLayout.id === layout.id && (
                        <span className="text-xs text-primary">Active</span>
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
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
