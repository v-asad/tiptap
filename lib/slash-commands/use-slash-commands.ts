"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { Editor } from "@tiptap/react";
import type { SlashCommand, SlashCommandState } from "./types";
import { defaultCommands, filterCommands } from "./commands";

interface UseSlashCommandsOptions {
  editor: Editor | null;
  commands?: SlashCommand[];
}

export function useSlashCommands({
  editor,
  commands = defaultCommands,
}: UseSlashCommandsOptions) {
  const [state, setState] = useState<SlashCommandState>({
    isOpen: false,
    query: "",
    range: null,
    position: null,
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

  const openMenu = useCallback(
    (
      range: { from: number; to: number },
      position: { top: number; left: number },
    ) => {
      setState({
        isOpen: true,
        query: "",
        range,
        position,
      });
      setSelectedIndex(0);
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setState({
      isOpen: false,
      query: "",
      range: null,
      position: null,
    });
    setSelectedIndex(0);
  }, []);

  const updateQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const updateRange = useCallback((range: { from: number; to: number }) => {
    setState((prev) => ({ ...prev, range }));
  }, []);

  const selectCommand = useCallback(
    (command: SlashCommand) => {
      if (!editor || !state.range) return;

      // Delete the slash command text (including the `/` and query)
      editor.chain().focus().deleteRange(state.range).run();

      // Execute the command action
      command.action(editor);

      closeMenu();
    },
    [editor, state.range, closeMenu],
  );

  const selectCurrentCommand = useCallback(() => {
    const command = filteredCommands[selectedIndex];
    if (command) {
      selectCommand(command);
    }
  }, [filteredCommands, selectedIndex, selectCommand]);

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
          selectCurrentCommand();
          return true;
        case "Escape":
          event.preventDefault();
          closeMenu();
          return true;
        default:
          return false;
      }
    },
    [state.isOpen, moveUp, moveDown, selectCurrentCommand, closeMenu],
  );

  return {
    state,
    selectedIndex,
    filteredCommands,
    openMenu,
    closeMenu,
    updateQuery,
    updateRange,
    selectCommand,
    selectCurrentCommand,
    moveUp,
    moveDown,
    handleKeyDown,
    setSelectedIndex,
  };
}
