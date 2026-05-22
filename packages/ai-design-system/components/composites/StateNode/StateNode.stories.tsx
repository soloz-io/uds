import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { StateNode } from "./StateNode";
import "@xyflow/react/dist/style.css";

/**
 * StateNode Composite Stories
 *
 * The StateNode component represents action/process nodes in workflow diagrams.
 * It displays darker-styled nodes for state machine states with status indicators
 * and supports disabled states.
 *
 * ## Features
 * - Darker background for state nodes
 * - Status badges (success, error)
 * - Animated border for running state
 * - Disabled state with opacity
 * - Connection handles (left: target, right: source)
 * - Icon and label display
 *
 * ## Accessibility
 * - Semantic HTML structure
 * - Status communicated via visual badges
 * - Disabled state indicated visually
 * - Keyboard navigation support via ReactFlow
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use for action/process nodes in workflows
 * - Provide clear, descriptive labels
 * - Use status prop to indicate execution state
 * - Set enabled=false to disable nodes
 *
 * ### Don'ts
 * - Don't use for event/condition nodes (use TransitionNode)
 * - Don't omit labels
 * - Don't use without ReactFlowProvider wrapper
 */
const meta = {
  title: "Composites/StateNode",
  component: StateNode,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div style={{ width: "300px", height: "300px" }}>
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
          "StateNode represents action/process nodes in workflow diagrams with darker styling.",
      },
    },
  },
} satisfies Meta<typeof StateNode>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state node with idle status
 */
export const Default: Story = {
  args: {
    id: "state-1",
    data: {
      label: "Approve Order",
      description: "Approve the order",
      type: "state",
      status: "idle",
    },
    selected: false,
  },
};

/**
 * Selected state node with border highlight
 */
export const Selected: Story = {
  args: {
    id: "state-2",
    data: {
      label: "Process Payment",
      description: "Process payment",
      type: "state",
      status: "idle",
    },
    selected: true,
  },
};

/**
 * Running state with animated border
 */
export const Running: Story = {
  args: {
    id: "state-3",
    data: {
      label: "Processing Order",
      description: "Processing",
      type: "state",
      status: "running",
    },
    selected: false,
  },
};

/**
 * Success state with green badge
 */
export const Success: Story = {
  args: {
    id: "state-4",
    data: {
      label: "Order Completed",
      description: "Success",
      type: "state",
      status: "success",
    },
    selected: false,
  },
};

/**
 * Error state with red badge
 */
export const Error: Story = {
  args: {
    id: "state-5",
    data: {
      label: "Order Failed",
      description: "Error occurred",
      type: "state",
      status: "error",
    },
    selected: false,
  },
};

/**
 * Disabled state with reduced opacity
 */
export const Disabled: Story = {
  args: {
    id: "state-6",
    data: {
      label: "Disabled Action",
      description: "Not enabled",
      type: "state",
      status: "idle",
      enabled: false,
    },
    selected: false,
  },
};

/**
 * State node without description
 */
export const WithoutDescription: Story = {
  args: {
    id: "state-7",
    data: {
      label: "Simple State",
      type: "state",
      status: "idle",
    },
    selected: false,
  },
};

/**
 * All status variants showcase
 */
export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      <StateNode
        id="idle"
        data={{
          label: "Idle",
          description: "Idle state",
          type: "state",
          status: "idle",
        }}
        selected={false}
      />
      <StateNode
        id="running"
        data={{
          label: "Running",
          description: "Running state",
          type: "state",
          status: "running",
        }}
        selected={false}
      />
      <StateNode
        id="success"
        data={{
          label: "Success",
          description: "Success state",
          type: "state",
          status: "success",
        }}
        selected={false}
      />
      <StateNode
        id="error"
        data={{
          label: "Error",
          description: "Error state",
          type: "state",
          status: "error",
        }}
        selected={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete showcase of all status variants available.",
      },
    },
  },
};

/**
 * Dark mode verification
 */
export const DarkMode: Story = {
  render: () => (
    <div
      className="dark"
      style={{
        padding: "24px",
        background: "hsl(222.2 84% 4.9%)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <StateNode
          id="dark-1"
          data={{
            label: "Approve Order",
            description: "Dark mode",
            type: "state",
            status: "idle",
          }}
          selected={false}
        />
        <StateNode
          id="dark-2"
          data={{
            label: "Running",
            description: "Dark mode",
            type: "state",
            status: "running",
          }}
          selected={false}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { disable: true },
    docs: {
      description: {
        story: "StateNode automatically adapts to dark mode.",
      },
    },
  },
};
