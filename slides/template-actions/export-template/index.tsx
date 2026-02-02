import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useSlidePreviews } from "../../ctx/slides-preview-context";
import { useEditorTheme } from "@/lib/theme-context";
import { downloadTemplateJSON } from "../template-actions.utils";

export const ExportTemplate = () => {
  const { theme } = useEditorTheme();
  const { slidePreviews } = useSlidePreviews();

  const handleExport = () => {
    const template = {
      theme: theme,
      slides: slidePreviews,
    };

    console.log("Downloading Template", template);

    downloadTemplateJSON(template);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <DownloadIcon /> <span>Export Template</span>
    </Button>
  );
};
