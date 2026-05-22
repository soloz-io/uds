import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { TransitionNode } from "./TransitionNode";
import "@xyflow/react/dist/style.css";

/**
 * TransitionNode Composite Stories
 *
 * The TransitionNode component represents event/condition nodes in workflow diagrams.
 * It displays lighter-styled nodes for state machine transitions with status indicators.
 *
 * ## Features
 * - Lighter background (secondary) for transition nodes
 * - Status badges (success, error)
 * - Animated border for running state
 * - Connection handles (left: target, right: source)
 * - Icon and label display
 *
 * ## Accessibility
 * - Semantic HTML structure
 * - Status communicated via visual badges
 * - Keyboard navigation support via ReactFlow
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use for event/condition nodes in workflows
 * - Provide clear, descriptive labels
 * - Use status prop to indicate execution state
 *
 * ### Don'ts
 * - Don't use for action/process nodes (use StateNode)
 * - Don't omit labels
 * - Don't use without ReactFlowProvider wrapper
 */
const meta = {
  title: "Composites/TransitionNode",
  component: TransitionNode,
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
          "TransitionNode represents event/condition nodes in workflow diagrams with lighter styling.",
      },
    },
  },
} satisfies Meta<typeof TransitionNode>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default transition node with idle status
 */
export const Default: Story = {
  args: {
    id: "transition-1",
    data: {
      label: "Order Requested",
      description: "Event triggered",
      type: "transition",
      status: "idle",
    },
    selected: false,
  },
};

/**
 * Selected transition node with border highlight
 */
export const Selected: Story = {
  args: {
    id: "transition-2",
    data: {
      label: "Order Approved",
      description: "Condition met",
      type: "transition",
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
    id: "transition-3",
    data: {
      label: "Checking Status",
      description: "Evaluating",
      type: "transition",
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
    id: "transition-4",
    data: {
      label: "Condition Passed",
      description: "Success",
      type: "transition",
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
    id: "transition-5",
    data: {
      label: "Condition Failed",
      description: "Error occurred",
      type: "transition",
      status: "error",
    },
    selected: false,
  },
};

/**
 * Transition node without description
 */
export const WithoutDescription: Story = {
  args: {
    id: "transition-6",
    data: {
      label: "Start",
      type: "transition",
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
      <TransitionNode
        id="idle"
        data={{
          label: "Idle",
          description: "Idle state",
          type: "transition",
          status: "idle",
        }}
        selected={false}
      />
      <TransitionNode
        id="running"
        data={{
          label: "Running",
          description: "Running state",
          type: "transition",
          status: "running",
        }}
        selected={false}
      />
      <TransitionNode
        id="success"
        data={{
          label: "Success",
          description: "Success state",
          type: "transition",
          status: "success",
        }}
        selected={false}
      />
      <TransitionNode
        id="error"
        data={{
          label: "Error",
          description: "Error state",
          type: "transition",
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
        <TransitionNode
          id="dark-1"
          data={{
            label: "Order Requested",
            description: "Dark mode",
            type: "transition",
            status: "idle",
          }}
          selected={false}
        />
        <TransitionNode
          id="dark-2"
          data={{
            label: "Running",
            description: "Dark mode",
            type: "transition",
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
        story: "TransitionNode automatically adapts to dark mode.",
      },
    },
  },
};
