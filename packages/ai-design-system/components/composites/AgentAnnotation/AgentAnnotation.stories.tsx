import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { AgentAnnotation } from "./AgentAnnotation";
import "@xyflow/react/dist/style.css";

/**
 * AgentAnnotation Composite Stories
 *
 * A wordless presence pin marking the screen or region an agent is actively
 * working on, completed, or stopped with error.
 *
 * ## Features
 * - Pulsing animated halo for active work
 * - Accessible hover label and screen reader text
 * - Color accents distinguishing concurrent agents
 * - Counter-scaled to maintain constant screen size across viewport zoom
 */
const meta = {
  title: "Composites/AgentAnnotation",
  component: AgentAnnotation,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="flex items-center justify-center p-8">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Wordless presence pin marking the active, completed, or failed screen position of a sub-agent.",
      },
    },
  },
} satisfies Meta<typeof AgentAnnotation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    id: "agent-pin-active",
    selected: false,
    data: {
      type: "agentAnnotation",
      agentName: "Coder Specialist",
      status: "active",
      colorIndex: 0,
    },
  },
};

export const Completed: Story = {
  args: {
    id: "agent-pin-completed",
    selected: false,
    data: {
      type: "agentAnnotation",
      agentName: "Architect Specialist",
      status: "completed",
      colorIndex: 1,
    },
  },
};

export const ErrorState: Story = {
  args: {
    id: "agent-pin-error",
    selected: false,
    data: {
      type: "agentAnnotation",
      agentName: "Review Specialist",
      status: "error",
      colorIndex: 3,
    },
  },
};

export const AmberAccent: Story = {
  args: {
    id: "agent-pin-amber",
    selected: false,
    data: {
      type: "agentAnnotation",
      agentName: "Data Engineer",
      status: "active",
      colorIndex: 2,
    },
  },
};
