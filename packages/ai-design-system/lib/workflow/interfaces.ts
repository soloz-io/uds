import type { Connection, EdgeChange, Node, NodeChange, OnConnectStartParams } from "@xyflow/react";
import type React from "react";
import type { StateNodeData } from "@/components/composites/StateNode";
import type { TransitionNodeData } from "@/components/composites/TransitionNode";
import type { TriggerNodeData } from "@/components/composites/TriggerNode";
import type { SpatialContainerNodeData } from "@/components/composites/SpatialContainerNode";
import type { DevicePreviewNodeData } from "@/components/composites/DevicePreviewNode";

export type WorkflowNodeData =
  | StateNodeData
  | TransitionNodeData
  | TriggerNodeData
  | SpatialContainerNodeData
  | DevicePreviewNodeData;
export type WorkflowNode = Node<WorkflowNodeData>;

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
}

export interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  onConnectStart?: (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void;
  onConnectEnd?: (event: MouseEvent | TouchEvent) => void;
  onPaneClick?: () => void;
  onNodeClick?: (event: React.MouseEvent, node: WorkflowNode) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: WorkflowEdge) => void;
  showMinimap?: boolean;
  interactive?: boolean;
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  topCenter?: React.ReactNode;
  className?: string;
}
