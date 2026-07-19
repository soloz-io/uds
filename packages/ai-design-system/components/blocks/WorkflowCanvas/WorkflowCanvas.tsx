"use client";

import {
  ConnectionMode,
  ReactFlowProvider,
  type Connection,
  type Node,
  useReactFlow,
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
import type { WorkflowCanvasProps, WorkflowEdge } from "./interfaces";
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
  topLeft,
  topRight,
  className,
}: WorkflowCanvasProps) {
  const { fitView } = useReactFlow();

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
        className="bg-background"
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
