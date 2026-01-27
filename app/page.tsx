import { SlideEditor } from "@/slides";
import { SlideEditorProvider } from "@/slides/ctx/use-slide-editor";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SlideEditorProvider>
        <SlideEditor />
      </SlideEditorProvider>
    </div>
  );
}
