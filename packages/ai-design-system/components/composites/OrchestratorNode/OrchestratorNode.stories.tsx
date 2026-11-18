import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { OrchestratorNode } from "./OrchestratorNode";
import "@xyflow/react/dist/style.css";

const meta = {
  title: "Composites/OrchestratorNode",
  component: OrchestratorNode,
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
} satisfies Meta<typeof OrchestratorNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "orchestrator",
    type: "orchestrator",
    data: {
      label: "Channel Orchestrator",
      description: "Coordinates brand discovery and initiates video sessions",
      type: "orchestrator",
      tools: ["ask_user"],
      interruptOn: { ask_user: { allowed_decisions: ["approve", "edit", "reject"] } },
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

export const SelectedWithSkills: Story = {
  args: {
    ...Default.args,
    id: "orchestrator-selected",
    data: {
      ...Default.args.data,
      skills: ["channel-setup", "video-kickoff"],
    },
    selected: true,
  },
};
