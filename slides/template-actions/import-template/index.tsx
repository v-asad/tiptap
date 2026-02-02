import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { SlidesTemplate } from "../template-actions.types";
import toast from "react-hot-toast";
import { useEditorTheme } from "@/lib/theme-context";
import { useSlidePreviews } from "@/slides/ctx/slides-preview-context";
import { useSlideEditorContext } from "@/slides/ctx/use-slide-editor";

export const ImportTemplate = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setTheme } = useEditorTheme();
  const { setSlidePreviews, setActiveSlide } = useSlidePreviews();
  const { editor } = useSlideEditorContext();

  const handleImport = (template: SlidesTemplate) => {
    const { id, contentJSON } = template.slides[0];

    setTheme(template.theme);
    setSlidePreviews(template.slides);
    setActiveSlide(id);

    editor?.commands.setContent(contentJSON);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files?.length === 0) return;

    const file = files[0];

    try {
      const text = await file.text();
      const json = JSON.parse(text) as SlidesTemplate;

      handleImport(json);

      e.target.value = "";
    } catch {
      toast.error("Could not parse template");
    }
  };

  return (
    <Button variant="outline" onClick={() => inputRef.current?.click()}>
      <UploadIcon /> <span>Import Template</span>
      <input ref={inputRef} type="file" onChange={handleFileChange} hidden />
    </Button>
  );
};
