"use client";

import React from "react";
import { useSlidePreviews } from "@/slides/ctx/slides-preview-context";
import { SlidePreview } from "./slide-preview";
import clsx from "clsx";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { titleLayout } from "@/slides/layouts";
import { useSlideEditorContext } from "@/slides/ctx/use-slide-editor";
import { flushSync } from "react-dom";

export const Filmstrip: React.FC = () => {
  const {
    slidePreviews,
    activeSlideId,
    setActiveSlide,
    deleteSlide,
    addSlide,
  } = useSlidePreviews();

  const { editor } = useSlideEditorContext();

  const handleAddSlide = () => {
    const newContent = {
      type: "doc",
      content: titleLayout.content,
    };

    flushSync(() => addSlide(newContent));
    editor?.commands.setContent(newContent);
  };

  const changeSlide = (id: string) => {
    const existingSlide = slidePreviews.find((s) => s.id === id);
    if (!existingSlide) return;

    flushSync(() => setActiveSlide(id));
    editor?.commands.setContent(existingSlide.contentJSON);
  };

  return (
    <div className="filmstrip flex flex-col h-full w-56 border-r border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Slides ({slidePreviews.length})
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddSlide}
          title="Add slide"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {slidePreviews.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-gray-400 text-center">No slides yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {slidePreviews.map((slidePreview) => {
              const isActive = slidePreview.id === activeSlideId;

              return (
                <div
                  key={slidePreview.id}
                  className={clsx(
                    "filmstrip-slide group relative rounded-md outline cursor-pointer transition-all",
                    "aspect-video overflow-hidden",
                    isActive
                      ? "outline-blue-500 bg-blue-50 shadow-md dark:bg-blue-950"
                      : "outline-gray-300 bg-white hover:border-gray-400 dark:outline-gray-600 dark:bg-gray-800 dark:hover:outline-gray-500",
                  )}
                  onClick={() => changeSlide(slidePreview.id)}
                >
                  <div className="h-full overflow-hidden">
                    <SlidePreview contentJSON={slidePreview.contentJSON} />
                  </div>

                  {isActive && (
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (slidePreviews.length > 1) {
                          deleteSlide(slidePreview.id);
                        }
                      }}
                      title="Delete slide"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
