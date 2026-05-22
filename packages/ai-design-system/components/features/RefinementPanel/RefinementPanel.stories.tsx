import type { Meta, StoryObj } from "@storybook/react";
import { RefinementPanel } from "./RefinementPanel";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useRefinementPanelMock } from "./useRefinementPanel.mock";
import { inputStateMessages, reviewStateMessages, sampleFileChanges } from "./RefinementPanel.mocks";
import * as React from "react";

const meta: Meta<typeof RefinementPanel> = {
  title: "Features/RefinementPanel",
  component: RefinementPanel,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RefinementPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Input State - Clean interface for submitting refinement requests
 *
 * Shows:
 * - Conversation history with previous interactions
 * - Prompt input for new refinement requests
 * - Simple, focused layout
 */
export const InputState: Story = {
  args: {
    messages: inputStateMessages,
    placeholder: "Ask a question or describe a task...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submitted:", message);
      alert(`Submitted: ${message.text}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Clean input interface for submitting refinement requests with conversation history. The user can type and submit new requests.",
      },
    },
  },
};

/**
 * Input State - Empty conversation
 *
 * Shows the empty state when no messages exist yet
 */
export const InputStateEmpty: Story = {
  args: {
    messages: [],
    placeholder: "Ask a question or describe a task...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submitted:", message);
    },
  },
};

/**
 * Multi-Agent Review State - Full workflow with agents, file changes, and approval
 *
 * Shows:
 * - Agent conversations with orchestrator and specialists
 * - Tool call displays showing agent actions
 * - Sub-agent indicators with status
 * - File change queue with approve/reject buttons
 * - Disabled input (textarea editable, submit blocked)
 */
export const MultiAgentReviewState: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    placeholder: "Continue refinement...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submit blocked during review:", message);
    },
    onApprove: () => {
      console.log("Approved all changes");
      alert("✅ All changes approved!");
    },
    onReject: () => {
      console.log("Rejected all changes");
      alert("❌ All changes rejected!");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full multi-agent review interface showing agent conversations, file changes, tool calls, and approval workflow. The input is disabled during review.",
      },
    },
  },
};

/**
 * With State Management - Interactive behavior demonstration
 *
 * Demonstrates the complete refinement workflow with mocked state management:
 * 1. User submits a refinement request
 * 2. System transitions to review state with file changes
 * 3. User approves or rejects changes
 * 4. System returns to input state
 *
 * This story uses the useMockRefinementPanel hook to simulate realistic interaction patterns.
 * Use this mock hook as a reference for implementing real application hooks.
 */
export const WithStateManagement: Story = {
  render: () => {
    // Use mocked hook for state management
    const { messages, fileChanges, handleSubmit, handleApprove, handleReject } =
      useRefinementPanelMock({
        initialMessages: inputStateMessages,
        reviewMessages: reviewStateMessages,
        reviewFileChanges: sampleFileChanges,
        apiDelay: 800,
      });

    return (
      <RefinementPanel
        messages={messages}
        fileChanges={fileChanges}
        placeholder="Ask a question or describe a task..."
        onSubmit={(message) => handleSubmit(message.text)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demonstration of the complete refinement workflow using the useMockRefinementPanel hook. This story simulates realistic user interactions including submission delays, state transitions, and approval/rejection flows. Use this mock hook as a reference for implementing real application hooks.",
      },
    },
  },
};

