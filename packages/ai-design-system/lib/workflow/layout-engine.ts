import ELK from 'elkjs';
import type { WorkflowNode, WorkflowEdge } from './interfaces';

interface ElkNode {
  id: string;
  layoutOptions?: Record<string, string>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children?: ElkNode[];
}

interface ElkGraph {
  id: string;
  layoutOptions?: Record<string, string>;
  children?: ElkNode[];
  edges?: Array<{
    id: string;
    sources: string[];
    targets: string[];
  }>;
}

/** Height of a compact transition: a pill on the edge between two states. */
const COMPACT_TRANSITION = { width: 200, height: 40 };

/**
 * The row a node is held to: triggers start the flow, and the end of every path
 * (a terminal state, a hand-off) is aligned at the bottom.
 */
function layerConstraint(n: WorkflowNode): string | undefined {
  const data = (n.data ?? {}) as Record<string, unknown>;
  if (n.type === 'trigger') return 'FIRST_SEPARATE';
  if ((n.type === 'state' && data.isTerminal === true) || data.handOff === true) return 'LAST_SEPARATE';
  return undefined;
}

const DEFAULT_NODE_WIDTH = 220;
const DEFAULT_NODE_HEIGHT = 56;
const DEFAULT_NODE_WITH_DESC_HEIGHT = 80;

/** Resolve the ELK layout dimensions for a single node. Return null to use defaults. */
export type NodeSizeResolver = (node: WorkflowNode) => { width: number; height: number } | null;

const elk = new ELK();

export async function getLayoutedElements(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  options?: {
    direction?: 'DOWN' | 'RIGHT' | 'UP' | 'LEFT';
    nodeSpacingX?: number;
    nodeSpacingY?: number;
    nodeSizeResolver?: NodeSizeResolver;
    elkOptions?: Record<string, string>;
  },
): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> {
  const {
    direction = 'DOWN',
    nodeSpacingX = 80,
    nodeSpacingY = 48,
    nodeSizeResolver,
    elkOptions = {},
  } = options ?? {};

  const graph: ElkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction,
      'elk.layered.spacing.nodeNodeBetweenLayers': String(nodeSpacingX),
      'elk.spacing.nodeNode': String(nodeSpacingY),
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'elk.layered.layering.strategy': 'LONGEST_PATH_SOURCE',
      'elk.layered.considerModelOrder': 'true',
      'elk.layered.cycleBreaking.strategy': 'GREEDY_MODEL_ORDER',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.edgeRouting': 'ORTHOGONAL',
      ...elkOptions,
    },
    children: nodes.map((n) => {
      const resolved = nodeSizeResolver?.(n);
      const data = (n.data ?? {}) as Record<string, unknown>;
      const hasDescription = Boolean(data.description);
      const isAgentNode = n.type === 'orchestrator' || n.type === 'specialist';
      const skillsCount = Array.isArray(data.skills) ? data.skills.length : 0;
      const toolsCount = Array.isArray(data.functionTools)
        ? data.functionTools.length
        : Array.isArray(data.tools)
          ? data.tools.length
          : 0;
      const hasSkills = isAgentNode && skillsCount > 0;
      const hasTools = isAgentNode && toolsCount > 0;

      // Realistic rendered heights for w-[220px] agent cards
      const headerHeight = 38;
      const descHeight = hasDescription ? 44 : 0;
      const skillsHeight = hasSkills ? (skillsCount > 1 ? 52 : 32) : 0;
      const toolsHeight = hasTools ? (toolsCount > 1 ? 52 : 32) : 0;
      const capPadding = hasSkills || hasTools ? 16 : 0;
      const calculatedAgentHeight = headerHeight + descHeight + skillsHeight + toolsHeight + capPadding;

      const compact = n.type === 'transition' && data.compact === true ? COMPACT_TRANSITION : null;
      const constraint = layerConstraint(n);
      return {
        id: n.id,
        ...(constraint ? { layoutOptions: { 'elk.layered.layering.layerConstraint': constraint } } : {}),
        width: resolved?.width ?? compact?.width ?? DEFAULT_NODE_WIDTH,
        height:
          resolved?.height ??
          compact?.height ??
          (isAgentNode
            ? Math.max(calculatedAgentHeight, 80)
            : hasDescription
              ? DEFAULT_NODE_WITH_DESC_HEIGHT
              : DEFAULT_NODE_HEIGHT),
      };
    }),
    edges: edges.map((e) => {
      return {
        id: e.id,
        sources: [e.source],
        targets: [e.target],
      };
    }),
  };

  const layout = await elk.layout(graph);

  const layoutedNodes: WorkflowNode[] = nodes.map((n) => {
    const elkNode = (layout.children ?? []).find((c: ElkNode) => c.id === n.id);
    if (!elkNode || elkNode.x == null || elkNode.y == null) return n;
    return {
      ...n,
      position: { x: elkNode.x, y: elkNode.y },
    };
  });

  const defaultSource = direction === 'RIGHT' ? 'source-right' : direction === 'DOWN' ? 'source-bottom' : undefined;
  const defaultTarget = direction === 'RIGHT' ? 'target-left' : direction === 'DOWN' ? 'target-top' : undefined;

  // The route ELK computed for each edge: its bend points, drawn by the edge so
  // parallel and returning edges keep apart instead of sharing one straight path.
  const routes = new Map(
    ((layout.edges ?? []) as Array<{ id: string; sections?: Array<{ bendPoints?: Array<{ x: number; y: number }> }> }>).map(
      (e) => [e.id, (e.sections ?? []).flatMap((s) => s.bendPoints ?? [])],
    ),
  );
  const layoutedEdges: WorkflowEdge[] = edges.map((e) => {
    const route = routes.get(e.id);
    return {
      ...e,
      sourceHandle: e.sourceHandle !== undefined ? e.sourceHandle : defaultSource,
      targetHandle: e.targetHandle !== undefined ? e.targetHandle : defaultTarget,
      ...(route && route.length > 0 ? { data: { ...(e.data ?? {}), route } } : {}),
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

