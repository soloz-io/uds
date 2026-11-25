import type { Meta, StoryObj } from "@storybook/react";
import { GraphView } from "./GraphView";
import { useGraphViewMock } from "./useGraphView.mock";
import { laterEdges, laterNodes, sampleBreadcrumbs, sampleEdges, sampleGroups, sampleNodes } from "./GraphView.mocks";

const meta = {
  title: "Features/GraphView",
  component: GraphView,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    nodes: { description: "Nodes with stable ids; each belongs to a group" },
    edges: { description: "Edges between node ids" },
    groups: { description: "Groups in column order; the viewer can hide or show each" },
    positions: { description: "Known positions to restore; new nodes are placed below their group" },
    status: { description: "Banner describing the state of the data shown" },
    details: { description: "Details of the selected node" },
  },
} satisfies Meta<typeof GraphView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A graph of grouped nodes */
export const Default: Story = {
  args: { nodes: sampleNodes, edges: sampleEdges, groups: sampleGroups },
};

/** A breadcrumb of the levels above, and an openable node */
export const WithBreadcrumbsAndOpenableNode: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    groups: sampleGroups,
    breadcrumbs: sampleBreadcrumbs,
    selectedNodeId: "validate",
    details: { title: "Validate order", subtitle: "validate" },
  },
};

/** The data behind the graph failed to update; the last valid graph stays visible */
export const WithErrorStatus: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    groups: sampleGroups,
    status: { tone: "error", title: "Latest data has errors — showing last valid graph", details: ["ship: unknown target \"warehouse\""] },
  },
};

/** No data yet */
export const Empty: Story = {
  args: {
    nodes: [],
    edges: [],
    groups: sampleGroups,
    emptyState: { title: "Awaiting the first model", description: "The graph appears as soon as data exists." },
  },
};

function GraphViewStateManagementStory() {
  const graph = useGraphViewMock({
    initialNodes: sampleNodes,
    initialEdges: sampleEdges,
    groups: sampleGroups,
    status: { tone: "neutral", title: "Graph current" },
    root: { id: "root", label: "Order system" },
  });
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="border-b border-border bg-muted/50 p-3 text-xs">
        <button
          type="button"
          className="rounded border border-border bg-card px-3 py-1"
          onClick={() => graph.grow(laterNodes, laterEdges)}
        >
          Add outputs
        </button>
        <span className="ml-3 text-muted-foreground">
          Drag a node, select one, hide a group, then add outputs: existing nodes keep their places. Open "Validate order" to descend; use the breadcrumb to return.
        </span>
      </div>
      <GraphView
        className="flex-1"
        nodes={graph.nodes}
        edges={graph.edges}
        groups={graph.groups}
        positions={graph.positions}
        onPositionsChange={graph.handlePositionsChange}
        hiddenGroupIds={graph.hiddenGroupIds}
        onHiddenGroupIdsChange={graph.handleHiddenGroupIdsChange}
        selectedNodeId={graph.selectedNodeId}
        onNodeSelect={graph.handleNodeSelect}
        status={graph.status}
        details={graph.details}
        breadcrumbs={graph.breadcrumbs}
        onBreadcrumbSelect={graph.handleBreadcrumbSelect}
        onNodeOpen={graph.handleNodeOpen}
      />
    </div>
  );
}

/** Positions, hidden groups and selection owned by a hook; the graph grows in place */
export const WithStateManagement: Story = {
  args: { nodes: [], edges: [], groups: [] },
  render: () => <GraphViewStateManagementStory />,
};
