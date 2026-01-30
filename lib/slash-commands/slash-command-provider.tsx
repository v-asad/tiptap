"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import type { Editor } from "@tiptap/react";
import { useSlashCommands } from "./use-slash-commands";
import { SlashCommandDropdown } from "./slash-command-dropdown";
import type { SlashCommand } from "./types";
import { defaultCommands } from "./commands";

interface SlashCommandContextValue {
  openMenu: (
    range: { from: number; to: number },
    position: { top: number; left: number }
  ) => void;
  closeMenu: () => void;
  updateQuery: (query: string) => void;
  updateRange: (range: { from: number; to: number }) => void;
  handleKeyDown: (event: KeyboardEvent) => boolean;
  isOpen: boolean;
}

const SlashCommandContext = createContext<SlashCommandContextValue | null>(
  null
);

export function useSlashCommandContext() {
  const context = useContext(SlashCommandContext);
  if (!context) {
    throw new Error(
      "useSlashCommandContext must be used within SlashCommandProvider"
    );
  }
  return context;
}

interface SlashCommandProviderProps {
  children: ReactNode;
  editor: Editor | null;
  commands?: SlashCommand[];
}

export function SlashCommandProvider({
  children,
  editor,
  commands = defaultCommands,
}: SlashCommandProviderProps) {
  const {
    state,
    selectedIndex,
    filteredCommands,
    openMenu,
    closeMenu,
    updateQuery,
    updateRange,
    selectCommand,
    handleKeyDown,
    setSelectedIndex,
  } = useSlashCommands({ editor, commands });

  const handleSelect = useCallback(
    (command: SlashCommand) => {
      selectCommand(command);
    },
    [selectCommand]
  );

  const handleHover = useCallback(
    (index: number) => {
      setSelectedIndex(index);
    },
    [setSelectedIndex]
  );

  return (
    <SlashCommandContext.Provider
      value={{
        openMenu,
        closeMenu,
        updateQuery,
        updateRange,
        handleKeyDown,
        isOpen: state.isOpen,
      }}
    >
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
    </SlashCommandContext.Provider>
  );
}
