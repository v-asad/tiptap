import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { NodeName } from "@/slides/slides.utils";
import { ChartView } from "./view";

export type ChartType = "line" | "bar" | "pie";

export type ChartDatum = {
  label: string;
  value: number;
};

export const DEFAULT_CHART_DATA: ChartDatum[] = [
  { label: "Q1", value: 32 },
  { label: "Q2", value: 48 },
  { label: "Q3", value: 27 },
  { label: "Q4", value: 58 },
];

const parseChartData = (raw: string | null): ChartDatum[] => {
  if (!raw) return DEFAULT_CHART_DATA;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_CHART_DATA;
    return parsed.map((item, index) => ({
      label: typeof item?.label === "string" ? item.label : `Item ${index + 1}`,
      value:
        typeof item?.value === "number" && Number.isFinite(item.value)
          ? item.value
          : Number(item?.value) || 0,
    }));
  } catch {
    return DEFAULT_CHART_DATA;
  }
};

export const ChartExt = Node.create({
  name: NodeName.CHART,

  group: "block",

  atom: true,

  draggable: false,

  selectable: false,

  defining: true,

  addAttributes() {
    return {
      chartType: {
        default: "bar",
        parseHTML: (element) => element.getAttribute("data-chart-type") || "bar",
        renderHTML: (attrs) => ({
          "data-chart-type": attrs.chartType,
        }),
      },
      data: {
        default: DEFAULT_CHART_DATA,
        parseHTML: (element) => parseChartData(element.getAttribute("data-chart")),
        renderHTML: (attrs) => ({
          "data-chart": JSON.stringify(attrs.data ?? []),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "chart",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["chart", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartView);
  },
});
