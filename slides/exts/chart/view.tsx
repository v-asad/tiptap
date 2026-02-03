import { ReactNodeViewProps } from "@tiptap/react";
import { BarChart3, LineChart, PieChart, Plus, Trash2 } from "lucide-react";
import { JSX, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";
import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { NodeActions } from "@/slides/node-actions";

import { DEFAULT_CHART_DATA, type ChartDatum, type ChartType } from "./index";

const CHART_SIZE = {
  width: 480,
  height: 260,
  padding: 32,
};

const chartTypeLabel: Record<ChartType, string> = {
  line: "Line chart",
  bar: "Bar chart",
  pie: "Pie chart",
};

const chartTypeIcon: Record<ChartType, JSX.Element> = {
  line: <LineChart className="size-4" />,
  bar: <BarChart3 className="size-4" />,
  pie: <PieChart className="size-4" />,
};

const normalizeData = (data: ChartDatum[] | undefined): ChartDatum[] => {
  if (!Array.isArray(data)) return DEFAULT_CHART_DATA;
  if (data.length === 0) return [];
  return data.map((item, index) => ({
    label:
      typeof item?.label === "string" && item.label.trim().length > 0
        ? item.label
        : `Item ${index + 1}`,
    value:
      typeof item?.value === "number" && Number.isFinite(item.value)
        ? item.value
        : Number(item?.value) || 0,
  }));
};

const seedDraftData = (data: ChartDatum[]) => {
  if (data.length > 0) return data;
  return [{ label: "", value: 0 }];
};

const createArcPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const toRadians = (angle: number) => (Math.PI / 180) * angle;
  const start = {
    x: cx + r * Math.cos(toRadians(endAngle)),
    y: cy + r * Math.sin(toRadians(endAngle)),
  };
  const end = {
    x: cx + r * Math.cos(toRadians(startAngle)),
    y: cy + r * Math.sin(toRadians(startAngle)),
  };
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

export const ChartView = (props: ReactNodeViewProps<HTMLDivElement>) => {
  const { node, updateAttributes } = props;
  const chartType = (node.attrs.chartType ?? "bar") as ChartType;
  const chartData = useMemo(
    () => normalizeData(node.attrs.data),
    [node.attrs.data],
  );
  const hasData = chartData.length > 0;

  const [open, setOpen] = useState(false);
  const [draftType, setDraftType] = useState<ChartType>(chartType);
  const [draftData, setDraftData] = useState<ChartDatum[]>(
    seedDraftData(chartData),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraftType(chartType);
      setDraftData(seedDraftData(chartData));
    }
  };

  const handleUpdateData = (index: number, updates: Partial<ChartDatum>) => {
    setDraftData((prev) =>
      prev.map((entry, idx) =>
        idx === index ? { ...entry, ...updates } : entry,
      ),
    );
  };

  const handleAddRow = () => {
    setDraftData((prev) => [
      ...prev,
      { label: `Item ${prev.length + 1}`, value: 10 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setDraftData((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    updateAttributes({
      chartType: draftType,
      data: normalizeData(draftData),
    });
    setOpen(false);
  };

  const maxValue = Math.max(
    1,
    ...chartData.map((item) => Math.max(0, item.value)),
  );

  const palette = [
    "var(--chart-accent)",
    "var(--chart-secondary)",
    "color-mix(in oklab, var(--chart-accent) 70%, var(--editor-bg))",
    "color-mix(in oklab, var(--chart-secondary) 70%, var(--editor-bg))",
    "color-mix(in oklab, var(--chart-text) 70%, var(--editor-bg))",
  ];

  const renderLineChart = () => {
    if (!hasData) return null;
    const { width, height, padding } = CHART_SIZE;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;
    const pointCount = chartData.length;

    const points = chartData.map((item, index) => {
      const progress = pointCount === 1 ? 0.5 : index / (pointCount - 1);
      const x = padding + plotWidth * progress;
      const y = padding + plotHeight * (1 - item.value / maxValue);
      return { x, y };
    });

    const path = points
      .map((point, index) =>
        index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
      )
      .join(" ");

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        aria-label="Line chart"
      >
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="var(--chart-grid)"
          strokeWidth={1}
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="var(--chart-grid)"
          strokeWidth={1}
        />
        <path
          d={path}
          fill="none"
          stroke="var(--chart-accent)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {points.map((point, index) => (
          <circle
            key={`line-dot-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="var(--chart-accent)"
          />
        ))}
      </svg>
    );
  };

  const renderBarChart = () => {
    if (!hasData) return null;
    const { width, height, padding } = CHART_SIZE;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;
    const gap = 12;
    const barWidth =
      chartData.length > 1
        ? (plotWidth - gap * (chartData.length - 1)) / chartData.length
        : plotWidth / 2;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        aria-label="Bar chart"
      >
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="var(--chart-grid)"
          strokeWidth={1}
        />
        {chartData.map((item, index) => {
          const valueHeight = (item.value / maxValue) * plotHeight;
          const x =
            padding +
            index * (barWidth + gap) +
            (chartData.length === 1 ? plotWidth / 4 : 0);
          const y = padding + (plotHeight - valueHeight);
          return (
            <rect
              key={`bar-${index}`}
              x={x}
              y={y}
              width={barWidth}
              height={valueHeight}
              rx={6}
              fill="var(--chart-secondary)"
            />
          );
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    if (!hasData) return null;
    const total = chartData.reduce(
      (sum, item) => sum + Math.max(0, item.value),
      0,
    );
    if (total <= 0) return null;
    const { width, height, padding } = CHART_SIZE;
    const radius = Math.min(width, height) / 2 - padding;
    const cx = width / 2;
    const cy = height / 2;
    let currentAngle = -90;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        aria-label="Pie chart"
      >
        {chartData.map((item, index) => {
          const sliceAngle = (Math.max(0, item.value) / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          currentAngle = endAngle;
          return (
            <path
              key={`slice-${index}`}
              d={createArcPath(cx, cy, radius, startAngle, endAngle)}
              fill={palette[index % palette.length]}
            />
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    const total = chartData.reduce(
      (sum, item) => sum + Math.max(0, item.value),
      0,
    );
    if (!hasData || (chartType === "pie" && total <= 0)) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-(--chart-muted)">
          Add data to render this chart.
        </div>
      );
    }

    switch (chartType) {
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      case "bar":
      default:
        return renderBarChart();
    }
  };

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.High}
      className="node-chart px-1 py-1"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <div
        className="rounded-lg border p-4 shadow-sm"
        style={{
          backgroundColor: "var(--chart-bg)",
          borderColor: "var(--chart-border)",
          color: "var(--chart-text)",
        }}
        contentEditable={false}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-(--chart-muted)">
              {chartTypeIcon[chartType]}
            </span>
            <span>{chartTypeLabel[chartType]}</span>
          </div>
          <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Edit data
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-90 sm:w-105">
              <SheetHeader>
                <SheetTitle>Chart data</SheetTitle>
                <SheetDescription>
                  Update chart type and values for this chart node.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label>Chart type</Label>
                  <Select
                    value={draftType}
                    onValueChange={(value) => setDraftType(value as ChartType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line chart</SelectItem>
                      <SelectItem value="bar">Bar chart</SelectItem>
                      <SelectItem value="pie">Pie chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Data points</Label>
                  <Button variant="outline" size="xs" onClick={handleAddRow}>
                    <Plus className="size-3" />
                    Add row
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  {draftData.map((item, index) => (
                    <div
                      key={`draft-row-${index}`}
                      className="grid grid-cols-[1fr_90px_auto] items-center gap-2"
                    >
                      <Input
                        value={item.label}
                        onChange={(event) =>
                          handleUpdateData(index, {
                            label: event.target.value,
                          })
                        }
                        placeholder="Label"
                      />
                      <Input
                        type="number"
                        value={Number.isFinite(item.value) ? item.value : 0}
                        onChange={(event) =>
                          handleUpdateData(index, {
                            value: Number.parseFloat(event.target.value) || 0,
                          })
                        }
                        min={0}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveRow(index)}
                        aria-label="Remove row"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div
          className={cn(
            "mt-4 h-56 rounded-md",
            !hasData &&
              "border border-dashed border-(--chart-border)",
          )}
          style={{
            backgroundColor: "color-mix(in oklab, var(--editor-bg) 75%, white)",
          }}
        >
          {renderChart()}
        </div>

        {hasData && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-(--chart-muted)">
            {chartData.map((item, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: palette[index % palette.length],
                  }}
                />
                <span className="truncate">{item.label}</span>
                <span className="ml-auto text-(--chart-text)">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DragDropNodeViewProvider>
  );
};
