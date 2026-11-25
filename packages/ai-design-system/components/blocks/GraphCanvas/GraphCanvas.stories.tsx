import type { Meta, StoryObj } from "@storybook/react";
import { GraphCanvas } from "./GraphCanvas";
import type { GraphCanvasEdge, GraphCanvasGroup, GraphCanvasNode } from "./interfaces";

/**
 * GraphCanvas Block Stories
 *
 * A generic, read-only graph of grouped nodes and edges. Each group is a column
 * the viewer can hide or show. Positions persist across updates; the viewport is
 * fitted once. The consuming application supplies all meaning.
 */
const groups: GraphCanvasGroup[] = [
  { id: "sources", label: "Sources", tone: "chart-1" },
  { id: "steps", label: "Steps", tone: "chart-2" },
  { id: "outputs", label: "Outputs", tone: "chart-3" },
];

const nodes: GraphCanvasNode[] = [
  { id: "orders", label: "Orders", caption: "Source", groupId: "sources" },
  { id: "customers", label: "Customers", caption: "Source", groupId: "sources" },
  { id: "validate", label: "Validate order", caption: "Step", groupId: "steps" },
  { id: "ship", label: "Ship order", caption: "Step", groupId: "steps" },
  { id: "invoice", label: "Invoice", caption: "Output", groupId: "outputs" },
];

const edges: GraphCanvasEdge[] = [
  { id: "e1", source: "orders", target: "validate", label: "feeds" },
  { id: "e2", source: "customers", target: "validate", label: "feeds" },
  { id: "e3", source: "validate", target: "ship", label: "then" },
  { id: "e4", source: "ship", target: "invoice", label: "produces" },
];

const meta = {
  title: "Blocks/GraphCanvas",
  component: GraphCanvas,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GraphCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Grouped nodes and edges */
export const Default: Story = {
  args: { nodes, edges, groups },
};

/** A selected node with its details */
export const WithSelectionAndDetails: Story = {
  args: {
    nodes,
    edges,
    groups,
    selectedNodeId: "validate",
    details: {
      title: "Validate order",
      subtitle: "validate",
      description: "Checks the order before it ships.",
      fields: [
        { label: "feeds ←", value: "orders" },
        { label: "then →", value: "ship" },
      ],
    },
  },
};

/** A group hidden by the viewer */
export const WithHiddenGroup: Story = {
  args: { nodes, edges, groups, hiddenGroupIds: ["outputs"] },
};

/** An informational status banner */
export const WithInfoStatus: Story = {
  args: { nodes, edges, groups, status: { tone: "info", title: "Newer data — updating" } },
};

/** An error status banner over the last good graph */
export const WithErrorStatus: Story = {
  args: {
    nodes,
    edges,
    groups,
    status: { tone: "error", title: "Latest data has errors — showing last valid graph", details: ["orders: field \"total\" is missing"] },
  },
};

/** No nodes yet */
export const Empty: Story = {
  args: {
    nodes: [],
    edges: [],
    groups,
    emptyState: { title: "Awaiting the first model", description: "Nodes appear here as soon as they exist." },
  },
};

/** Dark theme */
export const Dark: Story = {
  args: { nodes, edges, groups },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div className="dark h-screen w-full bg-background">
        <Story />
      </div>
    ),
  ],
};
