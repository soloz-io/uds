import type { GraphCanvasNode, GraphCanvasGroup, GraphPosition } from "./interfaces";

export const GRAPH_COLUMN_WIDTH = 300;
export const GRAPH_ROW_HEIGHT = 72;

/**
 * Positions every node. A node with a known position keeps it, so a graph that
 * grows keeps its layout; a new node goes below the others of its group, each
 * group in its own column, in the order the nodes are given.
 */
export function placeGraphNodes(
  nodes: readonly GraphCanvasNode[],
  groups: readonly GraphCanvasGroup[],
  known: Readonly<Record<string, GraphPosition>>
): Record<string, GraphPosition> {
  const column = new Map(groups.map((g, i) => [g.id, i]));
  const placed: Record<string, GraphPosition> = {};
  const bottom = new Map<string, number>();

  for (const n of nodes) {
    const p = known[n.id];
    if (!p) continue;
    placed[n.id] = p;
    bottom.set(n.groupId, Math.max(bottom.get(n.groupId) ?? -GRAPH_ROW_HEIGHT, p.y));
  }
  for (const n of nodes) {
    if (placed[n.id]) continue;
    const y = (bottom.get(n.groupId) ?? -GRAPH_ROW_HEIGHT) + GRAPH_ROW_HEIGHT;
    bottom.set(n.groupId, y);
    placed[n.id] = { x: (column.get(n.groupId) ?? groups.length) * GRAPH_COLUMN_WIDTH, y };
  }
  return placed;
}
