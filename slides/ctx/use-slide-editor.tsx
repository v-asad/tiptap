"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { Editor as TiptapEditor } from "@tiptap/react";
import { useTiptapEditor } from "./use-tiptap-editor";

type ActiveNode = {
  pos: number;
  size: number;
};

type SlideEditorContext = {
  editor: TiptapEditor | null;

  dropTarget?: string;
  setDropTarget: Dispatch<SetStateAction<SlideEditorContext["dropTarget"]>>;

  activeNode?: ActiveNode;
  setActiveNode: Dispatch<SetStateAction<SlideEditorContext["activeNode"]>>;
};

const slideEditorContext = createContext<SlideEditorContext | undefined>(
  undefined,
);

export const SlideEditorProvider = (props: PropsWithChildren) => {
  const [dropTarget, setDropTarget] =
    useState<SlideEditorContext["dropTarget"]>();

  const [activeNode, setActiveNode] =
    useState<SlideEditorContext["activeNode"]>();

  const { editor } = useTiptapEditor();

  return (
    <slideEditorContext.Provider
      value={{
        editor,
        dropTarget,
        setDropTarget,
        activeNode,
        setActiveNode,
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
