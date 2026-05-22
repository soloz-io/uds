import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { WorkflowToolbar } from "./WorkflowToolbar";

/**
 * WorkflowToolbar Stories
 *
 * The WorkflowToolbar is a composite component that combines primitives (Button, ButtonGroup, DropdownMenu)
 * to create a complete toolbar for workflow management actions.
 *
 * ## Features
 * - Workflow menu with dropdown
 * - Add step button
 * - Undo/Redo buttons with disabled states
 * - Save button with unsaved changes indicator
 * - Download button
 * - Visibility toggle (Public/Private)
 * - Run workflow button
 * - Responsive layout (desktop horizontal, mobile vertical)
 * - Read-only mode for non-owners
 * - Duplicate button for non-owners
 *
 * ## Accessibility
 * - All buttons have title attributes for tooltips
 * - Keyboard navigation support
 * - Disabled states clearly indicated
 * - ARIA labels for dropdowns
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Provide all necessary callbacks for actions
 * - Use loading states (isSaving, isExecuting, isDownloading)
 * - Show unsaved changes indicator
 * - Disable actions appropriately
 *
 * ### Don'ts
 * - Don't forget to handle state updates in callbacks
 * - Don't enable actions when workflow is not saved
 * - Don't mix owner and non-owner states
 */
const meta = {
  title: "Composites/WorkflowToolbar",
  component: WorkflowToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Workflow toolbar composite that combines primitives for workflow management actions.",
      },
    },
  },
  argTypes: {
    workflowVisibility: {
      control: "radio",
      options: ["public", "private"],
    },
  },
  args: {
    onSave: fn(),
    onUndo: fn(),
    onRedo: fn(),
    onDownload: fn(),
    onExecute: fn(),
    onAddStep: fn(),
    onToggleVisibility: fn(),
    onWorkflowSelect: fn(),
    onNewWorkflow: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
    onConfiguration: fn(),
  },
} satisfies Meta<typeof WorkflowToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toolbar with all actions enabled
 */
export const Default: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflowVisibility: "private",
    workflows: [
      { id: "workflow-123", name: "My Workflow" },
      { id: "workflow-456", name: "Another Workflow" },
      { id: "workflow-789", name: "Test Workflow" },
    ],
  },
};

/**
 * New workflow (not saved yet)
 */
export const NewWorkflow: Story = {
  args: {
    currentWorkflowId: null,
    isOwner: true,
    workflows: [
      { id: "workflow-123", name: "My Workflow" },
      { id: "workflow-456", name: "Another Workflow" },
    ],
  },
};

/**
 * Saving state
 */
export const Saving: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    isSaving: true,
    hasUnsavedChanges: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Unsaved changes indicator
 */
export const UnsavedChanges: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    hasUnsavedChanges: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Executing workflow
 */
export const Executing: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    isExecuting: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Downloading workflow
 */
export const Downloading: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    isDownloading: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Undo/Redo disabled
 */
export const UndoRedoDisabled: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    canUndo: false,
    canRedo: false,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Empty workflow (no nodes)
 */
export const EmptyWorkflow: Story = {
  args: {
    workflowName: "Empty Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    canUndo: false,
    canRedo: false,
    hasNodes: false,
    workflows: [{ id: "workflow-123", name: "Empty Workflow" }],
  },
};

/**
 * Public workflow
 */
export const PublicWorkflow: Story = {
  args: {
    workflowName: "Public Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    workflowVisibility: "public",
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "Public Workflow" }],
  },
};

/**
 * Read-only mode (non-owner viewing public workflow)
 */
export const ReadOnly: Story = {
  args: {
    workflowName: "Someone's Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: false,
    workflowVisibility: "public",
    hasNodes: true,
    workflows: [],
  },
};

/**
 * Read-only with duplicate button
 */
export const ReadOnlyWithDuplicate: Story = {
  args: {
    workflowName: "Someone's Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: false,
    isDuplicating: false,
    workflowVisibility: "public",
    hasNodes: true,
    workflows: [],
  },
};

/**
 * Duplicating workflow
 */
export const Duplicating: Story = {
  args: {
    workflowName: "Someone's Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: false,
    isDuplicating: true,
    workflowVisibility: "public",
    hasNodes: true,
    workflows: [],
  },
};

/**
 * No workflows available
 */
export const NoWorkflows: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [],
  },
};

/**
 * With selection (shows delete button on mobile)
 */
export const WithSelection: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    hasSelection: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Generating state (AI generating workflow)
 */
export const Generating: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    isGenerating: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [{ id: "workflow-123", name: "My Workflow" }],
  },
};

/**
 * Long workflow name
 */
export const LongWorkflowName: Story = {
  args: {
    workflowName: "This is a very long workflow name that should be truncated",
    currentWorkflowId: "workflow-123",
    isOwner: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: [
      {
        id: "workflow-123",
        name: "This is a very long workflow name that should be truncated",
      },
    ],
  },
};

/**
 * Many workflows
 */
export const ManyWorkflows: Story = {
  args: {
    workflowName: "My Workflow",
    currentWorkflowId: "workflow-5",
    isOwner: true,
    canUndo: true,
    canRedo: true,
    hasNodes: true,
    workflows: Array.from({ length: 20 }, (_, i) => ({
      id: `workflow-${i}`,
      name: `Workflow ${i + 1}`,
    })),
  },
};
