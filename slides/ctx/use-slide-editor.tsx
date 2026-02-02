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
import { useTiptapEditor } from "./use-tiptap-editor";
import { useSlashCommandEditor, type SlashCommand } from "@/lib/slash-commands";
import { useSlidePreviews } from "./slides-preview-context";

type ActiveNode = {
  pos: number;
  size: number;
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

export const SlideEditorProvider = (props: PropsWithChildren) => {
  const [dropTarget, setDropTarget] =
    useState<SlideEditorContext["dropTarget"]>();

  const [activeNode, setActiveNode] =
    useState<SlideEditorContext["activeNode"]>();

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

  return (
    <slideEditorContext.Provider
      value={{
        editor,
        dropTarget,
        setDropTarget,
        activeNode,
        setActiveNode,
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
