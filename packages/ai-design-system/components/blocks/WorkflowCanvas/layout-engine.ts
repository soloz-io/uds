import ELK from 'elkjs';
import type { WorkflowNode, WorkflowEdge } from './interfaces';

interface ElkNode {
  id: string;
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

const DEFAULT_NODE_WIDTH = 180;
const DEFAULT_NODE_HEIGHT = 52;

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
    nodeSpacingX = 60,
    nodeSpacingY = 40,
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
      'elk.layered.considerModelOrder': 'true',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      ...elkOptions,
    },
    children: nodes.map((n) => {
      const resolved = nodeSizeResolver?.(n);
      return {
        id: n.id,
        width: resolved?.width ?? DEFAULT_NODE_WIDTH,
        height: resolved?.height ?? DEFAULT_NODE_HEIGHT,
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

  const layoutedEdges: WorkflowEdge[] = edges.map((e) => ({
    ...e,
    sourceHandle: e.sourceHandle !== undefined ? e.sourceHandle : defaultSource,
    targetHandle: e.targetHandle !== undefined ? e.targetHandle : defaultTarget,
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

