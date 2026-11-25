/**
 * GraphView Behavior Tests
 *
 * Tests interactions and incremental updates, not visual appearance.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { GraphView } from "./GraphView";
import { sampleBreadcrumbs, sampleEdges, sampleGroups, sampleNodes } from "./GraphView.mocks";

const meta: Meta<typeof GraphView> = {
  title: "Features/GraphView/Behaviors",
  component: GraphView,
  tags: ["test"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GraphView>;

/** Clicking a node selects it */
export const ClickNodeSelects: Story = {
  args: { nodes: sampleNodes, edges: sampleEdges, groups: sampleGroups, onNodeSelect: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const node = await canvas.findByTestId("graph-node-validate");
    await userEvent.click(node);
    await waitFor(() => expect(args.onNodeSelect).toHaveBeenCalledWith("validate"));
  },
};

/** New nodes report their placement so the application can persist it */
export const PlacementIsReported: Story = {
  args: { nodes: sampleNodes, edges: sampleEdges, groups: sampleGroups, onPositionsChange: fn() },
  play: async ({ args }) => {
    await waitFor(() => expect(args.onPositionsChange).toHaveBeenCalled());
    const positions = (args.onPositionsChange as ReturnType<typeof fn>).mock.calls[0]![0] as Record<string, unknown>;
    await expect(Object.keys(positions).sort()).toEqual(sampleNodes.map((n) => n.id).sort());
  },
};

/** A known position is kept, not re-placed */
export const KnownPositionIsKept: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    groups: sampleGroups,
    positions: { orders: { x: 40, y: 400 } },
    onPositionsChange: fn(),
  },
  play: async ({ args }) => {
    await waitFor(() => expect(args.onPositionsChange).toHaveBeenCalled());
    const positions = (args.onPositionsChange as ReturnType<typeof fn>).mock.calls[0]![0] as Record<string, { x: number; y: number }>;
    await expect(positions.orders).toEqual({ x: 40, y: 400 });
  },
};

/** Hiding a group reports the hidden group ids */
export const HideGroup: Story = {
  args: { nodes: sampleNodes, edges: sampleEdges, groups: sampleGroups, onHiddenGroupIdsChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByLabelText("Steps"));
    await waitFor(() => expect(args.onHiddenGroupIdsChange).toHaveBeenCalledWith(["steps"]));
  },
};

/** An error status is announced */
export const ErrorStatusIsAnnounced: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    groups: sampleGroups,
    status: { tone: "error", title: "Latest data has errors", details: ["bad reference"] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Latest data has errors");
  },
};

/** Selecting an openable node does not open it; the Open button does */
export const OpenIsExplicit: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    groups: sampleGroups,
    selectedNodeId: "validate",
    details: { title: "Validate order" },
    onNodeSelect: fn(),
    onNodeOpen: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByTestId("graph-node-validate"));
    await expect(args.onNodeOpen).not.toHaveBeenCalled();
    await userEvent.click(await canvas.findByTestId("graph-canvas-open"));
    await waitFor(() => expect(args.onNodeOpen).toHaveBeenCalledWith("validate"));
  },
};

/** Selecting an earlier breadcrumb reports its index */
export const BreadcrumbReturns: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    groups: sampleGroups,
    breadcrumbs: sampleBreadcrumbs,
    onBreadcrumbSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText("Order system"));
    await waitFor(() => expect(args.onBreadcrumbSelect).toHaveBeenCalledWith(0));
  },
};
