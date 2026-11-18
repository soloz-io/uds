import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { SystemNode } from "./SystemNode";
import "@xyflow/react/dist/style.css";

const meta = {
  title: "Composites/SystemNode",
  component: SystemNode,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="p-6">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SystemNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "system-channel-builders",
    type: "system",
    data: {
      label: "channel-builders",
      description: "Channel MAS: Brand discovery & video orchestration",
      type: "system",
      status: "idle",
    },
    selected: false,
    dragging: false,
    zIndex: 0,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    id: "system-video-builders",
    data: {
      label: "video-builders",
      description: "Video MAS: Pipeline execution from brief to render",
      type: "system",
      status: "idle",
    },
    selected: true,
  },
};
