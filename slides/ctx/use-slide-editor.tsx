"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";

import { Editor as TiptapEditor } from "@tiptap/react";
import { TextSelection, NodeSelection } from "@tiptap/pm/state";
import { useTiptapEditor } from "./use-tiptap-editor";
import { useSlashCommandEditor, type SlashCommand } from "@/lib/slash-commands";
import { useSlidePreviews } from "./slides-preview-context";

type ActiveNode = {
  pos: number;
  size: number;
};

export type SelectionType = "text" | "node" | "none";

export type SelectionState = {
  type: SelectionType;
  nodeType: string | null;
  from: number;
  to: number;
  isEmpty: boolean;
};

type SlashCommandState = {
  isOpen: boolean;
  query: string;
  range: { from: number; to: number } | null;
  position: { top: number; left: number } | null;
};

type SlideEditorContext = {
  editor: TiptapEditor | null;

  dropTarget?: string;
  setDropTarget: Dispatch<SetStateAction<SlideEditorContext["dropTarget"]>>;

  activeNode?: ActiveNode;
  setActiveNode: Dispatch<SetStateAction<SlideEditorContext["activeNode"]>>;

  // Selection state
  selectionState: SelectionState;

  // Slash command state
  slashState: SlashCommandState;
  filteredCommands: SlashCommand[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectCommand: (command: SlashCommand) => void;
};

const slideEditorContext = createContext<SlideEditorContext | undefined>(
  undefined,
);

const defaultSelectionState: SelectionState = {
  type: "none",
  nodeType: null,
  from: 0,
  to: 0,
  isEmpty: true,
};

export const SlideEditorProvider = (props: PropsWithChildren) => {
  const [dropTarget, setDropTarget] =
    useState<SlideEditorContext["dropTarget"]>();

  const [activeNode, setActiveNode] =
    useState<SlideEditorContext["activeNode"]>();

  const [selectionState, setSelectionState] =
    useState<SelectionState>(defaultSelectionState);

  const { getActiveSlideContent, updateSlide } = useSlidePreviews();

  const {
    slashCommandExtension,
    setEditor,
    slashState,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    selectCommand,
  } = useSlashCommandEditor();

  const { editor } = useTiptapEditor({
    additionalExtensions: [slashCommandExtension],
    initialContent: getActiveSlideContent(),
  });

  // Set the editor reference for slash commands
  useEffect(() => {
    setEditor(editor);
  }, [editor, setEditor]);

  // Save editor content to current slide on change
  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => {
      const html = editor.getHTML();
      updateSlide(html);
    };

    editor.on("update", updateHandler);
    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor, updateSlide]);

  // Track selection state changes
  useEffect(() => {
    if (!editor) return;

    const updateSelectionState = () => {
      const { selection, doc } = editor.state;
      const { from, to, empty } = selection;

      if (selection instanceof NodeSelection) {
        const node = selection.node;
        setSelectionState({
          type: "node",
          nodeType: node.type.name,
          from,
          to,
          isEmpty: false,
        });
      } else if (selection instanceof TextSelection) {
        // Find the parent node of the selection
        const $from = doc.resolve(from);
        const parentNode = $from.parent;

        setSelectionState({
          type: "text",
          nodeType: parentNode.type.name,
          from,
          to,
          isEmpty: empty,
        });
      } else {
        setSelectionState(defaultSelectionState);
      }
    };

    // Initial update
    updateSelectionState();

    editor.on("selectionUpdate", updateSelectionState);
    return () => {
      editor.off("selectionUpdate", updateSelectionState);
    };
  }, [editor]);

  return (
    <slideEditorContext.Provider
      value={{
        editor,
        dropTarget,
        setDropTarget,
        activeNode,
        setActiveNode,
        selectionState,
        slashState,
        filteredCommands,
        selectedIndex,
        setSelectedIndex,
        selectCommand,
      }}
    >
      {props.children}
    </slideEditorContext.Provider>
  );
};

export const useSlideEditorContext = () => {
  const ctx = useContext(slideEditorContext);
  if (!ctx)
    throw new Error(
      "useSlideEditor must always be used within SlideEditorProvider",
    );

  return ctx;
};
