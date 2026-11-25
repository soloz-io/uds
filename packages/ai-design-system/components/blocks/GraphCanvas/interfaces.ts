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
  status?: GraphCanvasStatus;
  /** Details of the selected node, shown beside the graph */
  details?: GraphCanvasDetails;
  /** Shown when there are no nodes */
  emptyState?: { title: string; description?: string };
  className?: string;
}
