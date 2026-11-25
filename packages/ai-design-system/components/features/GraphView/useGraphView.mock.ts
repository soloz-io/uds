import { useCallback, useMemo, useState } from "react";
import type {
  GraphViewBreadcrumb,
  GraphViewDetails,
  GraphViewEdge,
  GraphViewGroup,
  GraphViewNode,
  GraphViewPosition,
  GraphViewStatus,
} from "./GraphView";

/**
 * Mock hook for GraphView state management.
 *
 * Simulates an application hook: it owns positions, hidden groups and
 * selection, derives the selected node's details, and can grow the graph to
 * show incremental updates. Real applications map their own data instead.
 */
export interface UseGraphViewReturn {
  nodes: GraphViewNode[];
  edges: GraphViewEdge[];
  groups: GraphViewGroup[];
  positions: Record<string, GraphViewPosition>;
  hiddenGroupIds: string[];
  selectedNodeId: string | null;
  status?: GraphViewStatus;
  details?: GraphViewDetails;
  loading: boolean;
  handlePositionsChange: (positions: Record<string, GraphViewPosition>) => void;
  handleHiddenGroupIdsChange: (hiddenGroupIds: string[]) => void;
  handleNodeSelect: (nodeId: string | null) => void;
  /** Where the viewer is in the hierarchy of graphs, outermost first */
  breadcrumbs: GraphViewBreadcrumb[];
  /** Returns to an earlier level */
  handleBreadcrumbSelect: (index: number) => void;
  /** Opens an openable node: an explicit action, never a side effect of selection */
  handleNodeOpen: (nodeId: string) => void;
  /** Mock only: adds nodes and edges, as new data would */
  grow: (nodes: GraphViewNode[], edges: GraphViewEdge[]) => void;
}

export interface UseGraphViewOptions {
  initialNodes?: GraphViewNode[];
  initialEdges?: GraphViewEdge[];
  groups?: GraphViewGroup[];
  status?: GraphViewStatus;
  root?: GraphViewBreadcrumb;
}

export function useGraphViewMock(options: UseGraphViewOptions = {}): UseGraphViewReturn {
  const { initialNodes = [], initialEdges = [], groups = [], status, root = { id: "root", label: "Graph" } } = options;
  const [nodes, setNodes] = useState<GraphViewNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphViewEdge[]>(initialEdges);
  const [positions, setPositions] = useState<Record<string, GraphViewPosition>>({});
  const [hiddenGroupIds, setHiddenGroupIds] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<GraphViewBreadcrumb[]>([root]);

  // Opening a node descends one level; a real application shows that level's graph.
  const handleNodeOpen = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      setBreadcrumbs((prev) => [...prev, { id: node.id, label: node.label }]);
      setSelectedNodeId(null);
    },
    [nodes]
  );
  const handleBreadcrumbSelect = useCallback((index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  const details = useMemo<GraphViewDetails | undefined>(() => {
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node) return undefined;
    return {
      title: node.label,
      subtitle: node.id,
      fields: edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) =>
          e.source === node.id
            ? { label: `${e.label ?? "to"} →`, value: e.target }
            : { label: `${e.label ?? "from"} ←`, value: e.source }
        ),
    };
  }, [nodes, edges, selectedNodeId]);

  const grow = useCallback((more: GraphViewNode[], moreEdges: GraphViewEdge[]) => {
    setNodes((prev) => [...prev, ...more.filter((n) => !prev.some((p) => p.id === n.id))]);
    setEdges((prev) => [...prev, ...moreEdges.filter((e) => !prev.some((p) => p.id === e.id))]);
  }, []);

  return {
    nodes,
    edges,
    groups,
    positions,
    hiddenGroupIds,
    selectedNodeId,
    status,
    details,
    loading: false,
    handlePositionsChange: setPositions,
    handleHiddenGroupIdsChange: setHiddenGroupIds,
    handleNodeSelect: setSelectedNodeId,
    breadcrumbs,
    handleBreadcrumbSelect,
    handleNodeOpen,
    grow,
  };
}
