"use client";

import {
  ReactFlowProvider,
  applyNodeChanges,
  type Edge as FlowEdge,
  type Node as FlowNode,
  type NodeChange,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Edge } from "@/components/ai-elements/edge";
import { Panel } from "@/components/ai-elements/panel";
import { GraphNodeCard } from "@/components/composites/GraphNodeCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/primitives/Alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/primitives/Card";
import { Icon } from "@/components/primitives/Icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/primitives/ToggleGroup";
import { cn } from "@/lib/utils";
import { placeGraphNodes } from "./graph-placement";
import type { GraphCanvasProps, GraphCanvasStatus, GraphPosition } from "./interfaces";
import "@xyflow/react/dist/style.css";

const nodeTypes = { graphNode: GraphNodeCard };
const edgeTypes = { straight: Edge.Strict };

const STATUS_ICON: Record<GraphCanvasStatus["tone"], string> = {
  neutral: "circle-check",
  info: "refresh-cw",
  warning: "alert-circle",
  error: "circle-x",
};

function GraphCanvasInner({
  nodes,
  edges,
  groups,
  positions,
  onPositionsChange,
  hiddenGroupIds,
  onHiddenGroupIdsChange,
  selectedNodeId,
  onNodeSelect,
  onEdgeSelect,
  status,
  details,
  className,
}: GraphCanvasProps) {
  // Hidden groups: controlled when the prop is given, local otherwise.
  const [localHidden, setLocalHidden] = useState<string[]>([]);
  const hidden = useMemo(() => new Set(hiddenGroupIds ?? localHidden), [hiddenGroupIds, localHidden]);

  // Positions the canvas placed or the viewer dragged, so a growing graph keeps its layout.
  const placedRef = useRef<Record<string, GraphPosition>>({});
  const emitPositions = useRef(onPositionsChange);
  useEffect(() => {
    emitPositions.current = onPositionsChange;
  }, [onPositionsChange]);

  const tone = useMemo(() => new Map(groups.map((g) => [g.id, g.tone ?? "muted"])), [groups]);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);

  useEffect(() => {
    const known = { ...placedRef.current, ...(positions ?? {}) };
    const placed = placeGraphNodes(nodes, groups, known);
    placedRef.current = placed;
    setFlowNodes((prev) => {
      const wasSelected = new Set(prev.filter((n) => n.selected).map((n) => n.id));
      return nodes
        .filter((n) => !hidden.has(n.groupId))
        .map((n) => ({
          id: n.id,
          type: "graphNode",
          position: placed[n.id]!,
          selected: selectedNodeId !== undefined ? selectedNodeId === n.id : wasSelected.has(n.id),
          data: { label: n.label, caption: n.caption, tone: tone.get(n.groupId) },
        }));
    });
    if (nodes.some((n) => !known[n.id])) emitPositions.current?.({ ...placed });
  }, [nodes, groups, positions, hidden, selectedNodeId, tone]);

  const flowEdges: FlowEdge[] = useMemo(() => {
    const shown = new Set(flowNodes.map((n) => n.id));
    return edges
      .filter((e) => shown.has(e.source) && shown.has(e.target))
      .map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label, type: "straight" }));
  }, [edges, flowNodes]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setFlowNodes((prev) => applyNodeChanges(changes, prev));
    let moved = false;
    for (const c of changes) {
      if (c.type === "position" && c.position) placedRef.current[c.id] = c.position;
      if (c.type === "position" && c.dragging === false) moved = true;
    }
    if (moved) emitPositions.current?.({ ...placedRef.current });
  }, []);

  const handleVisibleGroups = useCallback(
    (visible: string[]) => {
      const next = groups.map((g) => g.id).filter((id) => !visible.includes(id));
      if (hiddenGroupIds === undefined) setLocalHidden(next);
      onHiddenGroupIdsChange?.(next);
    },
    [groups, hiddenGroupIds, onHiddenGroupIdsChange]
  );

  return (
    <div className={cn("h-full w-full", className)} data-testid="graph-canvas">
      <Canvas
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable
        nodesConnectable={false}
        panOnDrag
        minZoom={0.1}
        onNodesChange={handleNodesChange}
        onNodeClick={(_event, node) => onNodeSelect?.(node.id)}
        onPaneClick={() => onNodeSelect?.(null)}
        onEdgeClick={(_event, edge) => onEdgeSelect?.(edge.id)}
      >
        <Panel className="pointer-events-auto border-none bg-transparent p-0" position="top-left">
          <ToggleGroup
            type="multiple"
            variant="outline"
            size="sm"
            value={groups.map((g) => g.id).filter((id) => !hidden.has(id))}
            onValueChange={handleVisibleGroups}
            aria-label="Visible groups"
          >
            {groups.map((g) => (
              <ToggleGroupItem key={g.id} value={g.id} aria-label={g.label} className="px-3 text-xs">
                {g.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Panel>

        {status && (
          <Panel className="pointer-events-auto border-none bg-transparent p-0" position="top-right">
            <Alert variant={status.tone === "error" ? "destructive" : "default"} className="max-w-sm">
              <Icon name={STATUS_ICON[status.tone]} size="sm" />
              <AlertTitle>{status.title}</AlertTitle>
              {status.details && status.details.length > 0 && (
                <AlertDescription>
                  <ul className="max-h-40 overflow-auto font-mono text-xs">
                    {status.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </AlertDescription>
              )}
            </Alert>
          </Panel>
        )}

        {details && (
          <Panel className="pointer-events-auto border-none bg-transparent p-0" position="bottom-right">
            <Card className="max-h-96 w-80 overflow-auto" data-testid="graph-canvas-details">
              <CardHeader>
                <CardTitle className="text-sm">{details.title}</CardTitle>
                {details.subtitle && <CardDescription className="font-mono text-xs">{details.subtitle}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {details.description && <p className="text-muted-foreground">{details.description}</p>}
                {details.fields && details.fields.length > 0 && (
                  <dl className="space-y-1 font-mono">
                    {details.fields.map((f) => (
                      <div key={`${f.label}:${f.value}`} className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">{f.label}</dt>
                        <dd className="min-w-0 break-all">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </CardContent>
            </Card>
          </Panel>
        )}
      </Canvas>
    </div>
  );
}

/**
 * GraphCanvas — a generic, read-only graph of grouped nodes and edges.
 *
 * Nodes keep their positions across updates: a node the canvas has already
 * placed (or that `positions` names) stays where it is, and a new node goes
 * below the others of its group. The viewport is fitted once, when the canvas
 * first shows nodes, and is never moved by later updates.
 */
export function GraphCanvas(props: GraphCanvasProps) {
  if (props.nodes.length === 0) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center p-4", props.className)} data-testid="graph-canvas-empty">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-sm">{props.emptyState?.title ?? "Nothing to show yet"}</CardTitle>
            {props.emptyState?.description && <CardDescription>{props.emptyState.description}</CardDescription>}
          </CardHeader>
          {props.status && props.status.details && props.status.details.length > 0 && (
            <CardContent>
              <Alert variant={props.status.tone === "error" ? "destructive" : "default"}>
                <Icon name={STATUS_ICON[props.status.tone]} size="sm" />
                <AlertTitle>{props.status.title}</AlertTitle>
                <AlertDescription>
                  <ul className="font-mono text-xs">
                    {props.status.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
