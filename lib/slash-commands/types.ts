import type { Editor } from "@tiptap/react";
import type { ReactNode } from "react";

export interface SlashCommand {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  keywords?: string[];
  action: (editor: Editor) => void;
}

export interface SlashCommandState {
  isOpen: boolean;
  query: string;
  range: { from: number; to: number } | null;
  position: { top: number; left: number } | null;
}
