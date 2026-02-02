"use client";

import { EditorContent } from "@tiptap/react";
import { useSlideEditorContext } from "./ctx/use-slide-editor";
import { DnDProvider } from "./ctx/dnd-provider";
import { ThemeDropdown } from "@/components/theme-dropdown";
import { LayoutDropdown } from "@/components/layout-dropdown";
import { SlashCommandDropdown } from "@/lib/slash-commands";
import { Filmstrip } from "@/components/filmstrip";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "./slides.utils";
import { ExportTemplate } from "./template-actions/export-template";
import { ImportTemplate } from "./template-actions/import-template";

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

      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ThemeDropdown />
            <LayoutDropdown />
          </div>

          <div className="flex items-center gap-2">
            <ExportTemplate />
            <ImportTemplate />
          </div>
        </div>

        <div
          className="editor-themed aspect-video w-full max-w-7xl rounded-lg shadow-2xl relative overflow-hidden"
          style={{
            minHeight: `${SLIDE_HEIGHT}px`,
            maxWidth: `${SLIDE_WIDTH}px`,
          }}
        >
          <DnDProvider>
            <EditorContent
              editor={editor}
              className="h-full *:flex *:flex-col *:justify-center *:p-10 *:focus:outline-none *:h-full"
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
  );
};
