"use client";

import { EditorContent } from "@tiptap/react";
import { useSlideEditorContext } from "./ctx/use-slide-editor";
import { DnDProvider } from "./ctx/dnd-provider";
import { SlashCommandDropdown } from "@/lib/slash-commands";
import { Filmstrip } from "@/components/filmstrip";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "./slides.utils";
import { EditorToolbar } from "./toolbar/editor-toolbar";
import { cn } from "@/lib/utils";

export const SlideEditor = () => {
  const {
    editor,
    slashState,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    selectCommand,
  } = useSlideEditorContext();

  return (
    <div className="flex w-full gap-0 relative">
      <Filmstrip />

      <div className="flex-1 flex items-start justify-start flex-col gap-4">
        <EditorToolbar />

        <div className="w-full h-full flex-1 overflow-y-auto">
          <div
            className="aspect-video w-full rounded-lg shadow relative flex items-start justify-start mx-4 my-2"
            style={{
              maxWidth: `${SLIDE_WIDTH}px`,
            }}
          >
            <span
              className="flex w-full border-t border-dashed border-black/20 h-1 overflow-hidden absolute left-0 z-1"
              style={{ top: `calc(${SLIDE_HEIGHT}px + 1px)` }}
            />

            <DnDProvider>
              <EditorContent
                editor={editor}
                className={cn(
                  "w-full h-full flex items-start justify-start",
                  "[&_.ProseMirror]:min-h-full [&_.ProseMirror]:w-full",
                  "[&_.ProseMirror]:flex [&_.ProseMirror]:flex-col [&_.ProseMirror]:justify-center [&_.ProseMirror]:p-10 [&_.ProseMirror]:focus:outline-none",
                  "[&_.ProseMirror]:editor-themed [&_.ProseMirror]:bg-(--editor-bg) [&_.ProseMirror]:text-(--editor-text) font-(--editor-body-font)",
                )}
                style={{
                  minHeight: `${SLIDE_HEIGHT}px`,
                }}
              />
            </DnDProvider>
          </div>

          {slashState.isOpen && (
            <SlashCommandDropdown
              commands={filteredCommands}
              selectedIndex={selectedIndex}
              position={slashState.position}
              onSelect={selectCommand}
              onHover={setSelectedIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
};
