import { SlidesTemplate } from "./template-actions.types";

export function downloadTemplateJSON(template: SlidesTemplate) {
  const jsonStr = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "template.json";
  a.click();

  URL.revokeObjectURL(url);
}
