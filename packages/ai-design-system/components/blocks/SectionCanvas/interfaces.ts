import type { WorkflowEdge, WorkflowNode } from "@/components/blocks/WorkflowCanvas";

/** One section of a sectioned view, such as a Business Model Canvas block. */
export interface CanvasSection {
  id: string;
  label: string;
  description?: string;
  items: Array<{ id: string; label: string; description?: string }>;
  /** What the section cannot show; listed with it, never filled in */
  gaps?: string[];
}

/** A section's cell on the grid: columns and rows are grid units. */
export interface CanvasCell {
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface SectionCanvasInput {
  sections: CanvasSection[];
  /** Where each section sits; sections without a cell flow after the placed ones */
  layout?: Record<string, CanvasCell>;
}

export interface SectionCanvasView {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  /** Sections with nothing to show */
  emptySections: string[];
}
