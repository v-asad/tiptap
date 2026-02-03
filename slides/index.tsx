"use client";

import { EditorContent } from "@tiptap/react";
import { useSlideEditorContext } from "./ctx/use-slide-editor";
import { DnDProvider } from "./ctx/dnd-provider";
import { SlashCommandDropdown } from "@/lib/slash-commands";
import { Filmstrip } from "@/components/filmstrip";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "./slides.utils";
import { EditorToolbar } from "./toolbar/editor-toolbar";

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
            className="editor-themed aspect-video w-full rounded-lg shadow relative flex items-start justify-start mx-4 my-2"
            style={{
              minHeight: `${SLIDE_HEIGHT}px`,
              maxWidth: `${SLIDE_WIDTH}px`,
            }}
          >
            <DnDProvider>
              <EditorContent
                editor={editor}
                className="h-full w-full flex items-start justify-start [&_.ProseMirror]:flex [&_.ProseMirror]:flex-col [&_.ProseMirror]:justify-center [&_.ProseMirror]:p-10 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-full [&_.ProseMirror]:w-full"
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
