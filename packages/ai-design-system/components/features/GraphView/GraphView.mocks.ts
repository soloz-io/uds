/**
 * Mock data for GraphView stories and tests
 */

import type { GraphViewBreadcrumb, GraphViewEdge, GraphViewGroup, GraphViewNode } from "./GraphView";

export const sampleGroups: GraphViewGroup[] = [
  { id: "sources", label: "Sources", tone: "chart-1" },
  { id: "steps", label: "Steps", tone: "chart-2" },
  { id: "outputs", label: "Outputs", tone: "chart-3" },
];

export const sampleNodes: GraphViewNode[] = [
  { id: "orders", label: "Orders", caption: "Source", groupId: "sources" },
  { id: "customers", label: "Customers", caption: "Source", groupId: "sources" },
  { id: "validate", label: "Validate order", caption: "Step", groupId: "steps", openable: true },
  { id: "ship", label: "Ship order", caption: "Step", groupId: "steps" },
];

export const sampleEdges: GraphViewEdge[] = [
  { id: "e1", source: "orders", target: "validate", label: "feeds" },
  { id: "e2", source: "customers", target: "validate", label: "feeds" },
  { id: "e3", source: "validate", target: "ship", label: "then" },
];

/** Where the viewer is: the outermost view first */
export const sampleBreadcrumbs: GraphViewBreadcrumb[] = [
  { id: "root", label: "Order system" },
  { id: "orders", label: "Orders" },
];

/** Nodes and edges that arrive later, to show the graph growing in place */
export const laterNodes: GraphViewNode[] = [
  { id: "invoice", label: "Invoice", caption: "Output", groupId: "outputs" },
  { id: "receipt", label: "Receipt", caption: "Output", groupId: "outputs" },
];

export const laterEdges: GraphViewEdge[] = [
  { id: "e4", source: "ship", target: "invoice", label: "produces" },
  { id: "e5", source: "invoice", target: "receipt", label: "then" },
];
