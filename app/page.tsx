import { SlideEditor } from "@/slides";
import { SlideEditorProvider } from "@/slides/ctx/use-slide-editor";
import { EditorThemeProvider } from "@/lib/theme-context";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-8 font-sans dark:bg-black">
      <EditorThemeProvider>
        <SlideEditorProvider>
          <SlideEditor />
        </SlideEditorProvider>
      </EditorThemeProvider>
    </div>
  );
}
