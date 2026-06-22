import type { Meta, StoryObj } from "@storybook/react";
import { RefinementPanel } from "./RefinementPanel";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useRefinementPanelMock } from "./useRefinementPanel.mock";
import {
  inputStateMessages,
  reviewStateMessages,
  sampleFileChanges,
  approvalQuestionRequest,
  approvalMultiQuestionRequest,
} from "./RefinementPanel.mocks";
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
    const { messages, fileChanges, onSubmit, handleApprove, handleReject } =
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
        onSubmit={onSubmit}
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

/**
 * Human In Loop - Single Interactive Question
 *
 * Shows the RefinementPanel in HITL state with a single interactive question
 * presented via the ApprovalCard. The agent has paused execution and is
 * waiting for the human to answer an integrative question before proceeding.
 *
 * This story demonstrates the "interrupt" pattern from LangGraph:
 * the agent uses `humanInTheLoopMiddleware` which interrupts on specified
 * tools and sends an `ActionRequest` to the UI for human review.
 */
export const HumanInLoopSingleQuestion: Story = {
  args: {
    messages: reviewStateMessages,
    approvalRequest: approvalQuestionRequest,
    reviewConfig: {
      allowedDecisions: ["approve", "reject"],
    },
    placeholder: "Input disabled during approval...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submit blocked during HITL:", message);
    },
    onApprovalApprove: () => {
      console.log("Approval request approved");
      alert("✅ Approval request approved! Continuing...");
    },
    onApprovalReject: (reason: string) => {
      console.log("Approval request rejected:", reason);
      alert(`❌ Approval request rejected: ${reason}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Human-in-the-loop state showing an interactive question from the agent. The agent uses LangGraph's `humanInTheLoopMiddleware` which generates a `NodeInterrupt` containing an `ActionRequest`. The UI renders an `ApprovalCard` with the question and options, replacing the input area. Once the human answers, the agent resumes execution.",
      },
    },
  },
};

/**
 * Human In Loop - Multi-Question Poll
 *
 * Shows the RefinementPanel in HITL state with multiple sequential questions
 * (a poll) presented via the ApprovalCard. The agent needs answers to
 * several integrative questions before proceeding with the workflow.
 */
export const HumanInLoopMultiQuestion: Story = {
  args: {
    messages: reviewStateMessages,
    approvalRequest: approvalMultiQuestionRequest,
    reviewConfig: {
      allowedDecisions: ["approve", "reject"],
    },
    placeholder: "Input disabled during approval...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submit blocked during HITL:", message);
    },
    onApprovalApprove: () => {
      console.log("Multi-question approved");
      alert("✅ All questions answered! Continuing...");
    },
    onApprovalReject: (reason: string) => {
      console.log("Multi-question rejected:", reason);
      alert(`❌ Questions rejected: ${reason}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Human-in-the-loop state showing a multi-question poll from the agent. The ApprovalCard renders multiple questions with navigation between them. This demonstrates the `questions` array pattern from `ActionRequest.args`, where each question has its own options and multi-select configuration.",
      },
    },
  },
};

/**
 * Human In Loop - With State Management
 *
 * Interactive demonstration of the complete HITL workflow using the
 * useMockRefinementPanel hook with an approval request configured.
 *
 * Flow:
 * 1. User submits a refinement request
 * 2. Agent pauses with an interactive question (HITL state)
 * 3. User answers the question and clicks Continue
 * 4. Agent resumes and generates file changes (review state)
 * 5. User approves or rejects changes
 * 6. System returns to input state
 */
export const HumanInLoopWithStateManagement: Story = {
  render: () => {
    const {
      messages,
      fileChanges,
      onSubmit,
      handleApprove,
      handleReject,
      approvalRequest,
      reviewConfig,
      handleApprovalApprove,
      handleApprovalReject,
      isApprovalProcessing,
    } = useRefinementPanelMock({
      initialMessages: inputStateMessages,
      approvalRequest: approvalQuestionRequest,
      reviewConfig: { allowedDecisions: ["approve", "reject"] },
      reviewMessages: reviewStateMessages,
      reviewFileChanges: sampleFileChanges,
      apiDelay: 800,
    });

    return (
      <RefinementPanel
        messages={messages}
        fileChanges={fileChanges}
        approvalRequest={approvalRequest}
        reviewConfig={reviewConfig}
        onApprovalApprove={handleApprovalApprove}
        onApprovalReject={handleApprovalReject}
        isApprovalProcessing={isApprovalProcessing}
        placeholder="Ask a question or describe a task..."
        onSubmit={onSubmit}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demonstration of the complete human-in-the-loop workflow. Submit a request → agent pauses with an integrative question → answer and continue → review file changes → approve/reject → done.",
      },
    },
  },
};

