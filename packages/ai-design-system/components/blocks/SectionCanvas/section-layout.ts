import type { WorkflowNode } from "@/components/blocks/WorkflowCanvas";
import type { SpatialContainerColorTheme } from "@/components/composites/SpatialContainerNode";
import type { CanvasCell, SectionCanvasInput, SectionCanvasView } from "./interfaces";

const UNIT_WIDTH = 150;
const ROW_HEIGHT = 210;
const GAP = 24;
const ORIGIN = 40;
const TONES: SpatialContainerColorTheme[] = ["blue", "emerald", "indigo", "purple", "amber", "cyan", "rose"];

/**
 * Lays out any sectioned view (a Business Model Canvas, an OKR board, a
 * customer's own view) as spatial containers on a grid. The view decides the
 * cells; this only draws them.
 */
export function sectionsToCanvas(input: SectionCanvasInput): SectionCanvasView {
  const placed = input.layout ?? {};
  const nextRow = Math.max(0, ...Object.values(placed).map((c) => c.row + (c.rowSpan ?? 1)));
  let flow = 0;
  const nodes: WorkflowNode[] = input.sections.map((section, index) => {
    const cell: CanvasCell = placed[section.id] ?? { col: (flow % 3) * 2, row: nextRow + Math.floor(flow++ / 3), colSpan: 2 };
    const colSpan = cell.colSpan ?? 1;
    const rowSpan = cell.rowSpan ?? 1;
    const gaps = section.gaps ?? [];
    const description = [section.description, gaps.length ? `Not shown:\n${gaps.map((g) => `- ${g}`).join("\n")}` : undefined]
      .filter(Boolean)
      .join("\n\n");
    const count = section.items.length;
    return {
      id: section.id,
      type: "spatialContainer",
      position: { x: ORIGIN + cell.col * (UNIT_WIDTH + GAP), y: ORIGIN + cell.row * (ROW_HEIGHT + GAP) },
      style: { width: colSpan * UNIT_WIDTH + (colSpan - 1) * GAP, height: rowSpan * ROW_HEIGHT + (rowSpan - 1) * GAP },
      data: {
        label: section.label,
        description: description || section.label,
        type: "spatialContainer",
        themeColor: TONES[index % TONES.length],
        variant: "extruded3d",
        icon: "box",
        badgeText: count === 0 ? "empty" : `${count} item${count === 1 ? "" : "s"}`,
        items: section.items.map((item) => ({ id: item.id, label: item.label, description: item.description })),
      },
    };
  });
  return { nodes, edges: [], emptySections: input.sections.filter((s) => s.items.length === 0).map((s) => s.id) };
}
