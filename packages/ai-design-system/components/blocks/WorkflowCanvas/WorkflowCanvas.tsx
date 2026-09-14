"use client";

import {
  ConnectionMode,
  ReactFlowProvider,
  type Connection,
  type Node,
  useReactFlow,
  useStoreApi,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection as ConnectionLine } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import { Panel } from "@/components/ai-elements/panel";
import { StateNode } from "@/components/composites/StateNode";
import { TransitionNode } from "@/components/composites/TransitionNode";
import { TriggerNode } from "@/components/composites/TriggerNode";
import { SpatialContainerNode } from "@/components/composites/SpatialContainerNode";
import { DevicePreviewNode } from "@/components/composites/DevicePreviewNode";
import { AgentAnnotation } from "@/components/composites/AgentAnnotation";
import type { WorkflowCanvasProps, WorkflowEdge } from "@/lib/workflow/interfaces";
import "@xyflow/react/dist/style.css";

// Bounded retry for node measurement — see the effect in WorkflowCanvasInner.
//
// ~30s, which sounds long and is not. The loop stops the instant every node
// reports handleBounds, so in the ordinary case it ends after one pass; the cap
// only bounds the pathological case where a node never appears at all.
//
// It was 3s, and that was too short for the case this exists to fix. The grid's
// device nodes each carry an iframe, and on a cold sandbox they are not in the
// DOM until Metro has served a bundle. `useUpdateNodeInternals` silently drops
// every id it cannot resolve, so a window that closes before the iframes mount
// spends all its attempts on nothing and gives up — leaving exactly the blank
// canvas of edgeless nodes it was added to prevent. Verified live: all five
// nodes resolvable, all five still `handleBounds: NULL`.
const MEASURE_RETRY_MS = 250;
const MEASURE_MAX_ATTEMPTS = 120;

const edgeTypes = {
  straight: Edge.Strict,
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

const nodeTypes = {
  state: StateNode,
  transition: TransitionNode,
  trigger: TriggerNode,
  spatialContainer: SpatialContainerNode,
  devicePreview: DevicePreviewNode,
  agentAnnotation: AgentAnnotation,
};

function WorkflowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectStart,
  onConnectEnd,
  onPaneClick,
  onNodeClick,
  onEdgeClick,
  interactive = false,
  panOnDrag = false,
  selectionOnDrag,
  topLeft,
  topRight,
  topCenter,
  fitViewSignal,
  className,
}: WorkflowCanvasProps) {
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const store = useStoreApi();

  /**
   * Force xyflow to measure the nodes it is showing.
   *
   * xyflow will not draw an edge until BOTH endpoints have `handleBounds` —
   * the measured position of each handle within its node — and those come from
   * one place only: the per-node ResizeObserver. Publishing `initialWidth` /
   * `initialHeight` (which the preview nodes do) satisfies the separate
   * `nodeHasDimensions` check that controls VISIBILITY, and does nothing for
   * `handleBounds`. The two are easy to conflate and fail very differently.
   *
   * When that observer does not deliver — it fires as an unsynchronized
   * callback (see the fitView effect below, which works around the same race),
   * and reports nothing for a node that is re-created but never changes size —
   * the result is not a missing node. It is a canvas of perfectly normal nodes
   * with EVERY edge silently absent: `edgeLookup` holds them all, each with
   * valid endpoints and handle ids, and not one is rendered. Observed live with
   * all five nodes at `measured: {}` and `handleBounds: null` while their DOM
   * elements had real size, and xyflow logged no warning.
   *
   * Keyed on the node ids rather than the `nodes` array, which is a new
   * reference on nearly every render.
   *
   * RETRIED, not fired once, because the request is silently dropped when it
   * is early. `useUpdateNodeInternals` resolves each id through
   * `domNode.querySelector('.react-flow__node[data-id=...]')` and keeps only
   * the ones it finds — a node that has not mounted yet is skipped with no
   * error and no retry, and since the id list has not changed, the effect
   * never runs again. One shot at 60ms worked for the single-device view and
   * missed the grid every time, where five nodes carrying iframes mount later.
   * So it repeats until the store actually reports `handleBounds`, and stops
   * the moment it does.
   */
  const nodeIdSignature = nodes.map((n) => n.id).join("|");
  useEffect(() => {
    if (!nodeIdSignature) return;
    const ids = nodeIdSignature.split("|");
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const measured = () => {
      const lookup = store.getState().nodeLookup;
      return ids.every((id) => !!lookup.get(id)?.internals?.handleBounds);
    };

    const pass = () => {
      updateNodeInternals(ids);
      attempts += 1;
      // `updateNodeInternals` defers its own work to a rAF, so the result is
      // only readable on a later tick — hence check on the next timer rather
      // than immediately after the call.
      timer = setTimeout(() => {
        if (!measured() && attempts < MEASURE_MAX_ATTEMPTS) pass();
      }, MEASURE_RETRY_MS);
    };

    timer = setTimeout(pass, 60);
    return () => clearTimeout(timer);
  }, [nodeIdSignature, updateNodeInternals, store]);

  // Opt-in re-fit, e.g. after the device-preview toolbar's Route select
  // switches to "All" and the node count/extent changes underneath the
  // user. Deliberately keyed on `fitViewSignal` alone, not `nodes`/`edges`
  // — those are new array references on nearly every render (activeEdgeIds
  // toggling an edge's type, status polling, ...), so fitting view on
  // every such change would override the user's own pan/zoom constantly.
  useEffect(() => {
    if (fitViewSignal === undefined) return;
    // A plain synchronous call, and even a double-rAF, both raced xyflow's
    // own internal node measurement — verified live in both cases: the
    // resulting scale was far smaller than the two device-preview nodes'
    // true combined width needed (computed against their real DOM rects:
    // ~1.2 would tightly fit them, but fitView produced ~0.57 and one node
    // still landed partly outside the pane). xyflow measures each node via
    // ResizeObserver, which fires as a separate, unsynchronized callback —
    // not guaranteed to have run even two animation frames after the nodes
    // prop change lands. A short real-time delay is the standard, if
    // inelegant, workaround for this exact class of race.
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
    return () => clearTimeout(timer);
  }, [fitViewSignal, fitView]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "/") {
        event.preventDefault();
        fitView({ padding: 0.2, duration: 300 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fitView]);

  const isValidConnection = useCallback(
    (connection: Connection | WorkflowEdge) => {
      if (!(connection.source && connection.target)) return false;
      if (connection.source === connection.target) return false;
      return true;
    },
    []
  );

  return (
    <div
      className={className}
      data-testid="workflow-canvas"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        panOnDrag={panOnDrag}
        selectionOnDrag={selectionOnDrag}
        className="bg-background [&_.react-flow\_\_handle]:opacity-0 [&_.react-flow\_\_handle]:pointer-events-none [&_.react-flow\_\_node:hover_.react-flow\_\_handle]:opacity-100 [&_.react-flow\_\_node:hover_.react-flow\_\_handle]:pointer-events-auto [&_.react-flow\_\_node.selected_.react-flow\_\_handle]:opacity-100 [&_.react-flow\_\_node.selected_.react-flow\_\_handle]:pointer-events-auto [&_.react-flow\_\_handle]:transition-opacity [&_.react-flow\_\_handle]:duration-150"
        connectionLineComponent={ConnectionLine}
        connectionMode={ConnectionMode.Strict}
        edges={edges}
        edgeTypes={edgeTypes}
        elementsSelectable={true}
        isValidConnection={isValidConnection}
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesConnectable={interactive}
        nodesDraggable={interactive}
        onConnect={interactive ? onConnect : undefined}
        onConnectEnd={interactive ? onConnectEnd : undefined}
        onConnectStart={interactive ? onConnectStart : undefined}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick as (event: React.MouseEvent, node: Node) => void}
        onEdgeClick={onEdgeClick}
      >
        {topLeft && (
          <Panel
            className="pointer-events-auto border-none bg-transparent p-0"
            position="top-left"
          >
            {topLeft}
          </Panel>
        )}
        {topRight && (
          <Panel
            className="pointer-events-auto border-none bg-transparent p-0"
            position="top-right"
          >
            {topRight}
          </Panel>
        )}
        {topCenter && (
          // Rendered top-left, not top-center — the prop name is legacy
          // (its one real consumer, the device-preview toolbar, moved to
          // left alignment; nothing else uses this slot for content that
          // actually wants centering).
          <Panel
            className="pointer-events-auto border-none bg-transparent p-0"
            position="top-left"
          >
            {topCenter}
          </Panel>
        )}
        <Panel
          className="workflow-controls-panel border-none bg-transparent p-0"
          position="bottom-left"
        >
          <Controls />
        </Panel>
      </Canvas>
    </div>
  );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
