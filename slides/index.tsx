"use client";

import { EditorContent } from "@tiptap/react";
import { useSlideEditorContext } from "./ctx/use-slide-editor";
import { DnDProvider } from "./ctx/dnd-provider";
import { ThemeDropdown } from "@/components/theme-dropdown";
import { LayoutDropdown } from "@/components/layout-dropdown";
import { SlashCommandDropdown } from "@/lib/slash-commands";

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
    <div className="flex w-full max-w-7xl flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <LayoutDropdown />
        <ThemeDropdown />
      </div>

      <div className="editor-themed aspect-video w-full rounded-lg shadow-2xl">
        <DnDProvider>
          <EditorContent
            editor={editor}
            className="h-full flex flex-col justify-center *:p-6 *:focus:outline-none"
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
  );
};
