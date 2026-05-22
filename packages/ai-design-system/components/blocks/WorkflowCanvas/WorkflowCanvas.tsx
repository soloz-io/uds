"use client";

import {
  ConnectionMode,
  MiniMap,
  ReactFlowProvider,
  type Node,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type OnConnectStartParams,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection as ConnectionLine } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import { Panel } from "@/components/ai-elements/panel";
import { StateNode } from "@/components/composites/StateNode";
import { TransitionNode } from "@/components/composites/TransitionNode";
import type { WorkflowCanvasProps, WorkflowEdge } from "./interfaces";
import "@xyflow/react/dist/style.css";

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

const nodeTypes = {
  state: StateNode,
  transition: TransitionNode,
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
  showMinimap = false,
  interactive = false,
  topLeft,
  topRight,
  className,
}: WorkflowCanvasProps) {
  const { fitView } = useReactFlow();
  const viewportInitialized = useRef(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!viewportInitialized.current && nodes.length > 0) {
      setTimeout(() => {
        fitView({ maxZoom: 1, minZoom: 0.5, padding: 0.2, duration: 0 });
        viewportInitialized.current = true;
        setIsCanvasReady(true);
      }, 0);
    }
  }, [nodes.length, fitView]);

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
        opacity: isCanvasReady ? 1 : 0,
        transition: "opacity 300ms",
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        className="bg-background"
        connectionLineComponent={ConnectionLine}
        connectionMode={ConnectionMode.Strict}
        edges={edges}
        edgeTypes={edgeTypes}
        elementsSelectable={interactive}
        isValidConnection={isValidConnection}
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesConnectable={interactive}
        nodesDraggable={interactive}
        onConnect={interactive ? onConnect : undefined}
        onConnectEnd={interactive ? onConnectEnd : undefined}
        onConnectStart={interactive ? onConnectStart : undefined}
        onEdgesChange={interactive ? onEdgesChange : undefined}
        onNodesChange={interactive ? onNodesChange : undefined}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
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
        <Panel
          className="workflow-controls-panel border-none bg-transparent p-0"
          position="bottom-left"
        >
          <Controls />
        </Panel>
        {showMinimap && (
          <MiniMap bgColor="var(--sidebar)" nodeStrokeColor="var(--border)" />
        )}
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
