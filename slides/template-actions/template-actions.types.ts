import { EditorTheme } from "@/lib/themes";
import { SlidePreview } from "../ctx/slides-preview-context";

export type SlidesTemplate = {
  theme: EditorTheme;
  slides: SlidePreview[];
};
