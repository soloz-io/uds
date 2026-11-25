import type { Meta, StoryObj } from "@storybook/react";
import { GraphStatusBanner } from "./GraphStatusBanner";

/**
 * GraphStatusBanner Composite Stories
 *
 * States whether the data a graph shows is current, updating, or failed — in
 * which case the graph keeps its last valid version and the banner lists why.
 */
const meta = {
  title: "Composites/GraphStatusBanner",
  component: GraphStatusBanner,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof GraphStatusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = { args: { tone: "neutral", title: "Graph current" } };

export const Updating: Story = { args: { tone: "info", title: "Newer data — updating" } };

export const Warning: Story = { args: { tone: "warning", title: "Some references are pending" } };

export const Error: Story = {
  args: {
    tone: "error",
    title: "Latest data has errors — showing last valid graph",
    details: ['orders: field "total" is missing', "ship: unknown target \"warehouse\""],
  },
};
