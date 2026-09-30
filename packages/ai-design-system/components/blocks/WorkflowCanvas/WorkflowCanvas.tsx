"use client";

import {
  ConnectionMode,
  ReactFlowProvider,
  type Connection,
  type Node,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const wasZeroSizeRef = useRef<boolean>(true);

  // Automatically fit view when the canvas container transitions from hidden (0x0)
  // to visible (e.g. mobile Overview icon clicked or tab activated)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          if (wasZeroSizeRef.current) {
            wasZeroSizeRef.current = false;
            // Delay slightly so xyflow's internal node measurements can settle
            const timer = setTimeout(() => {
              fitView({ padding: 0.2, duration: 300 });
            }, 60);
            return () => clearTimeout(timer);
          }
        } else {
          wasZeroSizeRef.current = true;
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fitView]);

  // Opt-in re-fit, e.g. after the device-preview toolbar's Route select
  // switches to "All" and the node count/extent changes underneath the
  // user. Deliberately keyed on `fitViewSignal` alone, not `nodes`/`edges`
  // — those are new array references on nearly every render (activeEdgeIds
  // toggling an edge's type, status polling, ...), so fitting view on
  // every such change would override the user's own pan/zoom constantly.
  useEffect(() => {
    if (fitViewSignal === undefined) return;
    const timer1 = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
    const timer2 = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
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
      ref={containerRef}
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
