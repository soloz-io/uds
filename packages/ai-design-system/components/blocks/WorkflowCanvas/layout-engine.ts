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

const NODE_WIDTH = 180;
const NODE_HEIGHT = 52;

const elk = new ELK();

export async function getLayoutedElements(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> {
  const graph: ElkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.spacing.nodeNode': '40',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'elk.layered.considerModelOrder': 'true',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
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

  const layoutedEdges: WorkflowEdge[] = edges.map((e) => ({
    ...e,
    sourceHandle: 'source-bottom',
    targetHandle: 'target-top',
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
