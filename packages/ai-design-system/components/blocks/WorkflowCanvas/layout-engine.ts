import ELK from 'elkjs';
import type { WorkflowNode, WorkflowEdge } from './interfaces';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 52;

const elk = new ELK();

export async function getLayoutedElements(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> {
  const graph = {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layout = await elk.layout(graph as any);

  const layoutedNodes: WorkflowNode[] = nodes.map((n) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elkNode = (layout.children ?? []).find((c: any) => c.id === n.id);
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
