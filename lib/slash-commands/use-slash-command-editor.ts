"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { Editor } from "@tiptap/react";
import {
  SlashCommandExtension,
  slashCommandPluginKey,
} from "./slash-command-extension";
import type { SlashCommand } from "./types";
import { defaultCommands, filterCommands } from "./commands";

interface UseSlashCommandEditorOptions {
  commands?: SlashCommand[];
}

export function useSlashCommandEditor(
  options: UseSlashCommandEditorOptions = {},
) {
  const { commands = defaultCommands } = options;
  const [editor, setEditor] = useState<Editor | null>(null);

  const [state, setState] = useState({
    isOpen: false,
    query: "",
    range: null as { from: number; to: number } | null,
    position: null as { top: number; left: number } | null,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(
    () => filterCommands(commands, state.query),
    [commands, state.query],
  );

  // Reset selected index when filtered commands change
  useEffect(() => {
    // eslint-disable-next-line
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  const closeMenu = useCallback(() => {
    setState({
      isOpen: false,
      query: "",
      range: null,
      position: null,
    });
    setSelectedIndex(0);
  }, []);

  const selectCommand = useCallback(
    (command: SlashCommand) => {
      if (!editor || !state.range) return;

      // Delete the slash command text
      editor.chain().focus().deleteRange(state.range).run();

      // Execute the command
      command.action(editor);

      // Close the menu and update plugin state
      closeMenu();
      editor.view.dispatch(
        editor.view.state.tr.setMeta(slashCommandPluginKey, {
          deactivate: true,
        }),
      );
    },
    [editor, state.range, closeMenu],
  );

  const moveUp = useCallback(() => {
    setSelectedIndex((prev) =>
      prev <= 0 ? filteredCommands.length - 1 : prev - 1,
    );
  }, [filteredCommands.length]);

  const moveDown = useCallback(() => {
    setSelectedIndex((prev) =>
      prev >= filteredCommands.length - 1 ? 0 : prev + 1,
    );
  }, [filteredCommands.length]);

  // Create the extension with callbacks
  const slashCommandExtension = useMemo(() => {
    return SlashCommandExtension.configure({
      triggerChar: "/",
      onOpen: (props) => {
        setState({
          isOpen: true,
          query: props.query,
          range: props.range,
          position: props.position,
        });
        setSelectedIndex(0);
      },
      onClose: () => {
        closeMenu();
      },
      onUpdate: (props) => {
        setState((prev) => ({
          ...prev,
          query: props.query,
          range: props.range,
        }));
      },
      onKeyDown: () => {
        // We need to handle this via ref since the extension is memoized
        return false;
      },
    });
  }, [closeMenu]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!state.isOpen) return false;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          moveUp();
          return true;
        case "ArrowDown":
          event.preventDefault();
          moveDown();
          return true;
        case "Enter":
          event.preventDefault();
          const command = filteredCommands[selectedIndex];
          if (command) {
            selectCommand(command);
          }
          return true;
        case "Escape":
          event.preventDefault();
          closeMenu();
          if (editor) {
            editor.view.dispatch(
              editor.view.state.tr.setMeta(slashCommandPluginKey, {
                deactivate: true,
              }),
            );
          }
          return true;
        default:
          return false;
      }
    },
    [
      state.isOpen,
      moveUp,
      moveDown,
      filteredCommands,
      selectedIndex,
      selectCommand,
      closeMenu,
      editor,
    ],
  );

  // Set up keyboard event listener on editor
  useEffect(() => {
    if (!editor) return;

    const handler = (event: KeyboardEvent) => {
      if (state.isOpen) {
        const handled = handleKeyDown(event);
        if (handled) {
          event.stopPropagation();
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("keydown", handler, { capture: true });

    return () => {
      editorElement.removeEventListener("keydown", handler, { capture: true });
    };
  }, [editor, state.isOpen, handleKeyDown]);

  // Close menu on click outside
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

  return {
    // Extension to add to Tiptap
    slashCommandExtension,
    // Call this when editor is created
    setEditor,
    // State for rendering dropdown
    slashState: state,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    selectCommand,
    closeMenu,
  };
}
