/**
 * Hook Contract Definition for GraphView
 *
 * The contract between the GraphView design-system feature and a consuming
 * application. The application implements this hook: it reads its own data,
 * maps it to generic nodes, edges and groups, and owns status and selection.
 *
 * @example
 * ```typescript
 * function MyGraphPage() {
 *   const graph = useGraphView();
 *   return (
 *     <GraphView
 *       nodes={graph.nodes}
 *       edges={graph.edges}
 *       groups={graph.groups}
 *       positions={graph.positions}
 *       onPositionsChange={graph.handlePositionsChange}
 *       hiddenGroupIds={graph.hiddenGroupIds}
 *       onHiddenGroupIdsChange={graph.handleHiddenGroupIdsChange}
 *       selectedNodeId={graph.selectedNodeId}
 *       onNodeSelect={graph.handleNodeSelect}
 *       status={graph.status}
 *       details={graph.details}
 *     />
 *   );
 * }
 * ```
 */

import type {
  GraphViewBreadcrumb,
  GraphViewDetails,
  GraphViewEdge,
  GraphViewGroup,
  GraphViewNode,
  GraphViewPosition,
  GraphViewStatus,
} from "./GraphView";

export interface UseGraphViewReturn {
  /** Nodes with stable ids, in the order they should appear within their group */
  nodes: GraphViewNode[];
  edges: GraphViewEdge[];
  /** Groups in column order */
  groups: GraphViewGroup[];
  /** Positions to restore, e.g. persisted from an earlier visit */
  positions: Record<string, GraphViewPosition>;
  hiddenGroupIds: string[];
  selectedNodeId: string | null;
  /** The state of the data shown, e.g. current, updating, or failed with the last valid graph */
  status?: GraphViewStatus;
  /** Details of the selected node */
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
}

export function useGraphView(): UseGraphViewReturn;
