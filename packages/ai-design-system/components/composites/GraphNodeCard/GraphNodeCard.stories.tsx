import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { GraphNodeCard } from "./GraphNodeCard";
import "@xyflow/react/dist/style.css";

/**
 * GraphNodeCard Composite Stories
 *
 * A generic node for graph views: a title, an optional caption, and the
 * design-token hue of its group. It carries no domain meaning; the consuming
 * application decides what a node, its caption and its group are.
 */
const meta = {
  title: "Composites/GraphNodeCard",
  component: GraphNodeCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="h-72 w-72">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof GraphNodeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A node with a caption in the first group hue */
export const Default: Story = {
  args: { id: "node-1", data: { label: "Order", caption: "Entity", tone: "chart-1" }, selected: false },
};

/** The selected node */
export const Selected: Story = {
  args: { id: "node-2", data: { label: "Order", caption: "Entity", tone: "chart-1" }, selected: true },
};

/** A node without a caption */
export const WithoutCaption: Story = {
  args: { id: "node-3", data: { label: "Approve order", tone: "chart-2" }, selected: false },
};

/** Every hue a group can take */
export const PrimaryTone: Story = {
  args: { id: "node-4", data: { label: "Primary group", caption: "Tone", tone: "primary" }, selected: false },
};

/** The muted hue, used when a group sets none */
export const MutedTone: Story = {
  args: { id: "node-5", data: { label: "Ungrouped", caption: "Tone", tone: "muted" }, selected: false },
};
