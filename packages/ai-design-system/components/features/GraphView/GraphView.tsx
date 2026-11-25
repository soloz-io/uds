"use client";

import { GraphCanvas } from "@/components/blocks/GraphCanvas";
import type {
  GraphCanvasBreadcrumb,
  GraphCanvasDetails,
  GraphCanvasEdge,
  GraphCanvasGroup,
  GraphCanvasNode,
  GraphCanvasProps,
  GraphCanvasStatus,
  GraphPosition,
  GraphTone,
} from "@/components/blocks/GraphCanvas";

export type GraphViewNode = GraphCanvasNode;
export type GraphViewEdge = GraphCanvasEdge;
export type GraphViewGroup = GraphCanvasGroup;
export type GraphViewStatus = GraphCanvasStatus;
export type GraphViewDetails = GraphCanvasDetails;
export type GraphViewPosition = GraphPosition;
export type GraphViewTone = GraphTone;
export type GraphViewBreadcrumb = GraphCanvasBreadcrumb;
export type GraphViewProps = GraphCanvasProps;

/**
 * GraphView — a live, read-only view of a graph of grouped nodes and edges.
 *
 * Generic: the consuming application maps its own data to nodes, edges and
 * groups, and decides the status and the details of the selected node. As the
 * data grows, existing nodes keep their positions, selection and the viewport
 * stay put, and new nodes appear below the others of their group.
 */
export function GraphView(props: GraphViewProps) {
  return <GraphCanvas {...props} />;
}
