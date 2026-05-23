import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WorkflowBuilder } from "./WorkflowBuilder";
import { useWorkflowBuilderMock } from "./useWorkflowBuilder.mock";
import { mockVersions, mockNodes, mockEdges } from "./WorkflowBuilder.mocks";

/**
 * WorkflowBuilder Feature
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
 * Pass individual props directly or wire up via `useWorkflowBuilder` hook
 * in the consuming application.
 *
 * ## Accessibility
 * - All toolbar buttons have `title` attributes for tooltips
 * - Keyboard navigation supported
 */
const meta = {
  title: "Features/WorkflowBuilder",
  component: WorkflowBuilder,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkflowBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkflowBuilderStateManagementStory() {
  const hook = useWorkflowBuilderMock("wf-1");

  return (
    <WorkflowBuilder
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

function WorkflowBuilderWithMinimapStory() {
  const hook = useWorkflowBuilderMock("wf-1");

  return (
    <WorkflowBuilder
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
  render: () => <WorkflowBuilderStateManagementStory />,
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
  render: () => <WorkflowBuilderWithMinimapStory />,
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
