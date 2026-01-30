"use client";

import { useEffect, useCallback, useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { useSlashCommands } from "./use-slash-commands";
import { SlashCommandDropdown } from "./slash-command-dropdown";
import {
  SlashCommandExtension,
  slashCommandPluginKey,
} from "./slash-command-extension";
import type { SlashCommand } from "./types";
import { defaultCommands } from "./commands";

interface SlashCommandEditorProps {
  editor: Editor | null;
  commands?: SlashCommand[];
  children: ReactNode;
}

export function SlashCommandEditor({
  editor,
  commands = defaultCommands,
  children,
}: SlashCommandEditorProps) {
  const {
    state,
    selectedIndex,
    filteredCommands,
    closeMenu,
    selectCommand,
    setSelectedIndex,
  } = useSlashCommands({ editor, commands });

  const handleSelect = useCallback(
    (command: SlashCommand) => {
      selectCommand(command);
    },
    [selectCommand],
  );

  const handleHover = useCallback(
    (index: number) => {
      setSelectedIndex(index);
    },
    [setSelectedIndex],
  );

  // Close menu when clicking outside
  useEffect(() => {
    if (!state.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".slash-command-dropdown")) {
        closeMenu();
        if (editor) {
          editor.view.dispatch(
            editor.view.state.tr.setMeta(slashCommandPluginKey, {
              deactivate: true,
            }),
          );
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state.isOpen, closeMenu, editor]);

  return (
    <>
      {children}
      {state.isOpen && (
        <SlashCommandDropdown
          commands={filteredCommands}
          selectedIndex={selectedIndex}
          position={state.position}
          onSelect={handleSelect}
          onHover={handleHover}
        />
      )}
    </>
  );
}

// Hook to create editor extension with callbacks
export function useSlashCommandExtension(
  _commands: SlashCommand[] = defaultCommands,
) {
  const [slashState, setSlashState] = useState<{
    isOpen: boolean;
    query: string;
    range: { from: number; to: number } | null;
    position: { top: number; left: number } | null;
  }>({
    isOpen: false,
    query: "",
    range: null,
    position: null,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [keyDownHandler, setKeyDownHandler] = useState<
    ((event: KeyboardEvent) => boolean) | null
  >(null);

  const openMenu = useCallback(
    (props: {
      range: { from: number; to: number };
      query: string;
      position: { top: number; left: number };
    }) => {
      setSlashState({
        isOpen: true,
        query: props.query,
        range: props.range,
        position: props.position,
      });
      setSelectedIndex(0);
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setSlashState({
      isOpen: false,
      query: "",
      range: null,
      position: null,
    });
    setSelectedIndex(0);
  }, []);

  const updateQueryAndRange = useCallback(
    (props: { range: { from: number; to: number }; query: string }) => {
      setSlashState((prev) => ({
        ...prev,
        query: props.query,
        range: props.range,
      }));
    },
    [],
  );

  // Create the extension with the callbacks
  const extension = SlashCommandExtension.configure({
    triggerChar: "/",
    onOpen: openMenu,
    onClose: closeMenu,
    onUpdate: updateQueryAndRange,
    onKeyDown: (event: KeyboardEvent) => {
      return keyDownHandler ? keyDownHandler(event) : false;
    },
  });

  return {
    extension,
    slashState,
    selectedIndex,
    setSelectedIndex,
    setKeyDownHandler,
    closeMenu,
  };
}
