import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { NodeChange, EdgeChange, Connection } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { WorkflowCanvas, type WorkflowNode, type WorkflowEdge } from "./WorkflowCanvas";
import { DevicePreviewToolbar } from "@/components/composites/DevicePreviewToolbar";
import "@xyflow/react/dist/style.css";

/**
 * WorkflowCanvas Stories
 *
 * WorkflowCanvas is a complete workflow canvas composite with ReactFlow integration.
 * It provides a visual canvas for building workflow diagrams with state and transition nodes.
 *
 * ## Features
 * - ReactFlow canvas with grid background
 * - State nodes and Transition nodes
 * - Bezier curve edges with animation
 * - Pan and zoom controls
 * - Minimap toggle
 * - Node drag and drop
 * - Edge creation by dragging from handles
 * - Duplicate connection prevention
 * - Delete nodes/edges with Backspace/Delete
 * - Keyboard shortcuts (Cmd+/ for fit view)
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Provide nodes and edges data
 * - Handle onNodesChange and onEdgesChange for state updates
 * - Use onConnect to handle new connections
 * - Set showMinimap for large workflows
 *
 * ### Don'ts
 * - Don't use without proper height container
 * - Don't mix node types incorrectly
 */
const meta = {
  title: "Blocks/WorkflowCanvas",
  component: WorkflowCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete workflow canvas composite with ReactFlow integration for building visual workflow diagrams.",
      },
    },
  },
} satisfies Meta<typeof WorkflowCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialNodes: WorkflowNode[] = [
  {
    id: "1",
    type: "transition",
    position: { x: 300, y: 50 },
    data: { label: "Start", type: "transition", status: "idle" },
  },
  {
    id: "2",
    type: "state",
    position: { x: 300, y: 130 },
    data: { label: "Approve Order", description: "Approve the order", type: "state", status: "idle" },
  },
  {
    id: "3",
    type: "transition",
    position: { x: 300, y: 210 },
    data: { label: "Order Approved", type: "transition", status: "idle" },
  },
  {
    id: "4",
    type: "state",
    position: { x: 300, y: 290 },
    data: { label: "Process Payment", description: "Process payment", type: "state", status: "idle" },
  },
];

const initialEdges: WorkflowEdge[] = [
  { id: "e1-2", source: "1", target: "2", type: "animated" },
  { id: "e2-3", source: "2", target: "3", type: "animated" },
  { id: "e3-4", source: "3", target: "4", type: "animated" },
];

/**
 * Default workflow canvas with basic nodes and edges
 */
export const Default: Story = {
  render: () => {
    const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
    const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);

    const onNodesChange = (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
    };

    const onEdgesChange = (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
    };

    const onConnect = (connection: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          id: `e${connection.source}-${connection.target}`,
          source: connection.source!,
          target: connection.target!,
          type: "animated",
        },
      ]);
    };

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>
    );
  },
};

/**
 * Workflow canvas with minimap enabled
 */
export const WithMinimap: Story = {
  render: () => {
    const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
    const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);

    const onNodesChange = (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
    };

    const onEdgesChange = (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
    };

    const onConnect = (connection: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          id: `e${connection.source}-${connection.target}`,
          source: connection.source!,
          target: connection.target!,
          type: "animated",
        },
      ]);
    };

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          showMinimap={true}
        />
      </div>
    );
  },
};

/**
 * Complex workflow with multiple branches
 */
export const ComplexWorkflow: Story = {
  render: () => {
    const complexNodes: WorkflowNode[] = [
      { id: "start",      type: "transition", position: { x: 300, y: 0   }, data: { label: "Start",                   type: "transition", status: "idle" } },
      { id: "req",        type: "transition", position: { x: 300, y: 100 }, data: { label: "Order Requested",         type: "transition", status: "idle" } },
      { id: "approve",    type: "state",      position: { x: 100, y: 200 }, data: { label: "Approve Order",           type: "state",      status: "idle" } },
      { id: "reject",     type: "state",      position: { x: 500, y: 200 }, data: { label: "Reject Order",            type: "state",      status: "idle" } },
      { id: "cancel",     type: "state",      position: { x: 0,   y: 320 }, data: { label: "Cancel Order",            type: "state",      status: "idle" } },
      { id: "approved",   type: "transition", position: { x: 200, y: 320 }, data: { label: "Order Approved",          type: "transition", status: "idle" } },
      { id: "rejected",   type: "transition", position: { x: 500, y: 320 }, data: { label: "Order Rejected",          type: "transition", status: "idle" } },
      { id: "start_proc", type: "state",      position: { x: 300, y: 420 }, data: { label: "Start Order Processing",  type: "state",      status: "idle" } },
      { id: "cancelled",  type: "transition", position: { x: 0,   y: 440 }, data: { label: "Order Cancelled",         type: "transition", status: "idle" } },
      { id: "complete",   type: "state",      position: { x: 150, y: 540 }, data: { label: "Complete Order Processing",type: "state",     status: "idle" } },
      { id: "processing", type: "transition", position: { x: 400, y: 540 }, data: { label: "Order Processing",        type: "transition", status: "idle" } },
      { id: "hold",       type: "state",      position: { x: 600, y: 540 }, data: { label: "Place Order On Hold",     type: "state",      status: "idle" } },
      { id: "resume",     type: "state",      position: { x: 750, y: 420 }, data: { label: "Resume Order Processing", type: "state",      status: "idle" } },
      { id: "ready",      type: "transition", position: { x: 150, y: 660 }, data: { label: "Order Ready for Delivery",type: "transition", status: "idle" } },
      { id: "on_hold",    type: "transition", position: { x: 600, y: 660 }, data: { label: "Order On Hold",           type: "transition", status: "idle" } },
    ];

    const complexEdges: WorkflowEdge[] = [
      { id: "e1",  source: "start",     target: "req",        type: "animated" },
      { id: "e2",  source: "req",       target: "approve",    type: "animated" },
      { id: "e3",  source: "req",       target: "reject",     type: "animated" },
      { id: "e4",  source: "approve",   target: "cancel",     type: "animated" },
      { id: "e5",  source: "approve",   target: "approved",   type: "animated" },
      { id: "e6",  source: "reject",    target: "rejected",   type: "animated" },
      { id: "e7",  source: "approved",  target: "start_proc", type: "animated" },
      { id: "e8",  source: "cancel",    target: "cancelled",  type: "animated" },
      { id: "e9",  source: "start_proc",target: "complete",   type: "animated" },
      { id: "e10", source: "start_proc",target: "processing", type: "animated" },
      { id: "e11", source: "processing",target: "hold",       type: "animated" },
      { id: "e12", source: "hold",      target: "resume",     type: "animated" },
      { id: "e13", source: "complete",  target: "ready",      type: "animated" },
      { id: "e14", source: "hold",      target: "on_hold",    type: "animated" },
    ];

    const [nodes, setNodes] = useState<WorkflowNode[]>(complexNodes);
    const [edges, setEdges] = useState<WorkflowEdge[]>(complexEdges);

    const onNodesChange = (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
    };

    const onEdgesChange = (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
    };

    const onConnect = (connection: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          id: `e${connection.source}-${connection.target}`,
          source: connection.source!,
          target: connection.target!,
          type: "animated",
        },
      ]);
    };

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          showMinimap={true}
        />
      </div>
    );
  },
};

/**
 * Empty workflow canvas
 */
export const Empty: Story = {
  render: () => {
    const [nodes, setNodes] = useState<WorkflowNode[]>([]);
    const [edges, setEdges] = useState<WorkflowEdge[]>([]);

    const onNodesChange = (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
    };

    const onEdgesChange = (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
    };

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </div>
    );
  },
};

/**
 * Device Preview mode — `devicePreview` nodes + the DevicePreviewToolbar in
 * the topCenter panel slot (the config the BuilderPage 'Preview' tab uses).
 */
export const DevicePreviewMode: Story = {
  render: () => {
    const [nodes, setNodes] = useState<WorkflowNode[]>(() => {
      const routes = ["/login", "/signup", "/dashboard", "/settings"];
      return routes.map((route, i) => ({
        id: `preview-${i}`,
        type: "devicePreview",
        position: { x: (i % 2) * 500, y: Math.floor(i / 2) * 760 },
        data: {
          type: "devicePreview",
          src: "about:blank",
          label: `demo-app · ${route}`,
          route,
          presetId: "iphone-16-pro",
          showRouteBadge: true,
        },
      }));
    });
    const [viewMode, setViewMode] = useState<"play" | "single" | "interactive" | "grid">("grid");
    const [activeRoute, setActiveRoute] = useState("/login");
    const [presetId, setPresetId] = useState("iphone-16-pro");

    const onNodesChange = (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
    };

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <WorkflowCanvas
          nodes={nodes}
          edges={[]}
          onNodesChange={onNodesChange}
          interactive
          topCenter={
            <DevicePreviewToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              routes={[
                { id: "/login", label: "Login" },
                { id: "/signup", label: "Signup" },
                { id: "/dashboard", label: "Dashboard" },
                { id: "/settings", label: "Settings" },
              ]}
              activeRoute={activeRoute}
              onRouteChange={setActiveRoute}
              devicePresetId={presetId}
              onDevicePresetChange={setPresetId}
            />
          }
        />
      </div>
    );
  },
};
