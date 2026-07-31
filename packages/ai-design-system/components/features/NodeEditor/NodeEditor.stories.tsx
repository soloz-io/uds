import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NodeEditor } from "./NodeEditor";
import { useNodeEditorMock } from "./useNodeEditor.mock";
import { mockVersions, mockNodes, mockEdges, mockSpatialNodes, mockSpatialEdges } from "./NodeEditor.mocks";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { ToolbarAction } from "@/components/composites/WorkflowToolbar";

/**
 * NodeEditor Feature
 *
 * Complete workflow editing experience combining a floating toolbar
 * with a ReactFlow canvas for building state machine workflows.
 *
 * ## Features
 * - Workflow name display with version selector
 * - Undo / Redo / Save / Cancel action buttons
 * - ReactFlow canvas with state and transition nodes
 * - Interactive edge creation and node dragging
 * - Minimap support
 *
 * ## Usage
 * Pass individual props directly or wire up via `useNodeEditor` hook
 * in the consuming application.
 *
 * ## Accessibility
 * - All toolbar buttons have `title` attributes for tooltips
 * - Keyboard navigation supported
 */
const meta = {
  title: "Features/NodeEditor",
  component: NodeEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof NodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

function NodeEditorStateManagementStory() {
  const hook = useNodeEditorMock("wf-1");

  return (
    <NodeEditor
      workflowName={hook.workflowName}
      versions={hook.versions}
      currentVersionId={hook.currentVersionId}
      onVersionSelect={hook.onVersionSelect}
      nodes={hook.nodes}
      edges={hook.edges}
      onNodesChange={hook.onNodesChange}
      onEdgesChange={hook.onEdgesChange}
      onConnect={hook.onConnect}
      isSaving={hook.isSaving}
      hasUnsavedChanges={hook.hasUnsavedChanges}
      canUndo={hook.canUndo}
      canRedo={hook.canRedo}
      onSave={hook.onSave}
      onCancel={hook.onCancel}
      onUndo={hook.onUndo}
      onRedo={hook.onRedo}
      interactive={true}
    />
  );
}

function NodeEditorWithMinimapStory() {
  const hook = useNodeEditorMock("wf-1");

  return (
    <NodeEditor
      workflowName={hook.workflowName}
      versions={hook.versions}
      currentVersionId={hook.currentVersionId}
      onVersionSelect={hook.onVersionSelect}
      nodes={hook.nodes}
      edges={hook.edges}
      showMinimap={true}
    />
  );
}

/**
 * Default — read-only canvas with mock data
 */
export const Default: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: mockEdges,
    canUndo: false,
    canRedo: false,
    isSaving: false,
    hasUnsavedChanges: false,
  },
};

/**
 * WithStateManagement — full interactive mock hook wired up
 */
export const WithStateManagement: Story = {
  render: () => <NodeEditorStateManagementStory />,
};

/**
 * Empty — no nodes
 */
export const Empty: Story = {
  args: {
    workflowName: "New Workflow",
    versions: [{ id: "v1", label: "v1" }],
    currentVersionId: "v1",
    nodes: [],
    edges: [],
  },
};

/**
 * WithMinimap — canvas with minimap enabled
 */
export const WithMinimap: Story = {
  render: () => <NodeEditorWithMinimapStory />,
};

/**
 * Saving — save in progress state
 */
export const Saving: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: [],
    isSaving: true,
    hasUnsavedChanges: true,
    canUndo: true,
    canRedo: false,
  },
};

/**
 * WithHITLApproval — single HITL transition node with a floating DefaultSwitcher
 * containing workflow-defined approval options beside the node.
 */
function NodeEditorWithHITLApprovalStory() {
  const [selectedValue, setSelectedValue] = React.useState("");

  const hitlNode: WorkflowNode = {
    id: "hitl-1",
    type: "transition",
    position: { x: 300, y: 100 },
    data: {
      label: "Human Approval",
      description: "Manager review required",
      type: "transition",
      status: "idle",
    },
  };

  const nodeActions: Record<string, ToolbarAction[]> = {
    "hitl-1": [
      {
        id: "switcher-hitl-1",
        icon: "chevrons-up-down",
        title: "Select approval decision",
        switcher: {
          items: [
            { label: "Approve", value: "approve" },
            { label: "Reject", value: "reject" },
          ],
          value: selectedValue,
          onValueChange: setSelectedValue,
          placeholder: "Do you approve this evaluation?",
        },
      },
    ],
  };

  return (
    <NodeEditor
      workflowName="HITL Approval"
      versions={[{ id: "v1", label: "v1" }]}
      currentVersionId="v1"
      nodes={[hitlNode]}
      edges={[]}
      nodeActions={nodeActions}
      interactive={false}
      hideDefaultActions={true}
      showMinimap={false}
    />
  );
}

export const WithHITLApproval: Story = {
  render: () => <NodeEditorWithHITLApprovalStory />,
};

/**
 * SpatialGridLayout — 2.5D visual container grid layout (Business Model Canvas / Spatial Architecture)
 *
 * Showcases NodeEditor with Spatial Container parent nodes (`spatialContainer`), 2.5D extrusion styling,
 * nested child nodes (`parentId`), and spatial ribbon connections.
 */
export const SpatialGridLayout: Story = {
  args: {
    hideWorkflowName: true,
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockSpatialNodes,
    edges: mockSpatialEdges,
    interactive: true,
    showMinimap: true,
    canUndo: true,
    canRedo: true,
  },
};

