import { SlideEditor } from "@/slides";
import { SlideEditorProvider } from "@/slides/ctx/use-slide-editor";
import { EditorThemeProvider } from "@/lib/theme-context";
import { SlidePreviewsProvider } from "@/slides/ctx/slides-preview-context";
import { CatsTemplate } from "@/slides/templates";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-0 bg-background p-0 font-sans dark:bg-black">
      <EditorThemeProvider defaultTheme={CatsTemplate.theme}>
        <SlidePreviewsProvider>
          <SlideEditorProvider>
            <SlideEditor />
          </SlideEditorProvider>
        </SlidePreviewsProvider>
      </EditorThemeProvider>
    </div>
  );
}
