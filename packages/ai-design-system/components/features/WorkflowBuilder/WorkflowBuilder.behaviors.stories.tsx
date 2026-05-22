/**
 * WorkflowBuilder Behavior Tests
 *
 * Tests user interactions and state changes to prevent regressions.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { WorkflowBuilder } from "./WorkflowBuilder";
import { mockVersions, mockNodes, mockEdges } from "./WorkflowBuilder.mocks";

const meta = {
  title: "Features/WorkflowBuilder/Behaviors",
  component: WorkflowBuilder,
  tags: ["test"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkflowBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Version Select Behavior
 *
 * Tests that the version dropdown opens and lists versions.
 */
export const VersionSelect: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    onVersionSelect: fn(),
    nodes: mockNodes,
    edges: mockEdges,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const versionTrigger = canvas.getByTitle("Select version");
    await expect(versionTrigger).toBeInTheDocument();

    await userEvent.click(versionTrigger);

    const v1 = await canvas.findByText("v1");
    await expect(v1).toBeInTheDocument();
  },
};

/**
 * Undo Disabled Initially
 *
 * Tests that the undo button is disabled when canUndo is false.
 */
export const UndoDisabledInitially: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: mockEdges,
    canUndo: false,
    canRedo: false,
    onUndo: fn(),
    onRedo: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const undoButton = canvas.getByTitle("Undo");
    await expect(undoButton).toBeInTheDocument();
    await expect(undoButton).toBeDisabled();
  },
};

/**
 * Save Button Triggers Callback
 *
 * Tests that clicking save calls onSave.
 */
export const SaveButtonTriggersCallback: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: mockEdges,
    canUndo: true,
    isSaving: false,
    hasUnsavedChanges: true,
    onSave: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const saveButton = canvas.getByTitle("Save");
    await expect(saveButton).toBeInTheDocument();

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(args.onSave).toHaveBeenCalled();
    });
  },
};

/**
 * Cancel Button Triggers Callback
 *
 * Tests that clicking cancel calls onCancel.
 */
export const CancelButtonTriggersCallback: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: mockEdges,
    onSave: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const cancelButton = canvas.getByTitle("Cancel");
    await expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(args.onCancel).toHaveBeenCalled();
    });
  },
};
