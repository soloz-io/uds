/** A design-token hue for a group of nodes. */
export type GraphTone = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5" | "primary" | "muted";

/** A set of nodes shown in one column, which the viewer can hide or show. */
export interface GraphCanvasGroup {
  id: string;
  label: string;
  tone?: GraphTone;
}

/** A node. Its id is stable across updates; the canvas keys position and selection on it. */
export interface GraphCanvasNode {
  id: string;
  label: string;
  /** Secondary line, e.g. the node's kind */
  caption?: string;
  groupId: string;
  /** The node leads to another view the viewer can open (see onNodeOpen) */
  openable?: boolean;
}

export interface GraphCanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphPosition {
  x: number;
  y: number;
}

/** A banner describing the state of the data the graph shows. */
export interface GraphCanvasStatus {
  tone: "neutral" | "info" | "warning" | "error";
  title: string;
  details?: string[];
}

/** What the details panel shows for the selected node. */
export interface GraphCanvasDetails {
  title: string;
  subtitle?: string;
  description?: string;
  fields?: Array<{ label: string; value: string }>;
}

/** One level of a graph hierarchy shown in the breadcrumb. */
export interface GraphCanvasBreadcrumb {
  id: string;
  label: string;
}

export interface GraphCanvasProps {
  nodes: GraphCanvasNode[];
  edges: GraphCanvasEdge[];
  /** Groups in column order */
  groups: GraphCanvasGroup[];
  /**
   * Known positions by node id. A node without one is placed below the others
   * of its group; a node with one keeps it, so incremental updates keep the layout.
   */
  positions?: Record<string, GraphPosition>;
  /** Called with every node's position after placement or a drag */
  onPositionsChange?: (positions: Record<string, GraphPosition>) => void;
  hiddenGroupIds?: string[];
  onHiddenGroupIdsChange?: (hiddenGroupIds: string[]) => void;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  onEdgeSelect?: (edgeId: string) => void;
  /**
   * Opens an openable node: an explicit action (double-click, or the Open
   * button in the details panel), never a side effect of selecting it.
   */
  onNodeOpen?: (nodeId: string) => void;
  /** Label of the details panel's open button (default "Open") */
  openLabel?: string;
  /** Where the viewer is in a hierarchy of graphs, outermost first */
  breadcrumbs?: GraphCanvasBreadcrumb[];
  onBreadcrumbSelect?: (index: number) => void;
  status?: GraphCanvasStatus;
  /** Details of the selected node, shown beside the graph */
  details?: GraphCanvasDetails;
  /** Shown when there are no nodes */
  emptyState?: { title: string; description?: string };
  className?: string;
}
