import type { Meta, StoryObj } from "@storybook/react";
import { ChatPanel } from "./ChatPanel";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useChatPanelMock } from "./useChatPanel.mock";
import {
  inputStateMessages,
  reviewStateMessages,
  sampleFileChanges,
  approvalQuestionRequest,
  approvalMultiQuestionRequest,
} from "./ChatPanel.mocks";
import * as React from "react";

const meta: Meta<typeof ChatPanel> = {
  title: "Features/ChatPanel",
  component: ChatPanel,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Input State - Clean interface for submitting chat requests
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
 */
export const InputStateEmpty: Story = {
  args: {
    messages: [],
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
          "Initial empty state when starting a new refinement thread.",
      },
    },
  },
};

/**
 * Review State - Showing multi-agent generated file changes
 */
export const ReviewState: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    placeholder: "Input disabled during review...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submit blocked during review:", message);
    },
    onApprove: () => {
      console.log("Approved all changes");
      alert("✅ Approved all changes!");
    },
    onReject: () => {
      console.log("Rejected all changes");
      alert("❌ Rejected all changes!");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-agent review interface showing agent reasoning and generated file changes awaiting user approval.",
      },
    },
  },
};

/**
 * Human In Loop - Question Approval
 */
export const HumanInLoopQuestion: Story = {
  args: {
    messages: inputStateMessages,
    approvalRequest: approvalQuestionRequest,
    reviewConfig: {
      allowedDecisions: ["approve", "reject"],
    },
    placeholder: "Input disabled during approval...",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submit blocked during HITL:", message);
    },
    onApprovalApprove: () => {
      console.log("Question approved");
      alert("✅ Question answered! Continuing...");
    },
    onApprovalReject: (reason: string) => {
      console.log("Question rejected:", reason);
      alert(`❌ Question rejected: ${reason}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Human-in-the-loop state showing an interactive question from the agent requiring user answer.",
      },
    },
  },
};

/**
 * Human In Loop - Multi Question Approval
 */
export const HumanInLoopMultiQuestion: Story = {
  args: {
    messages: inputStateMessages,
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
          "Human-in-the-loop state showing a multi-question poll from the agent.",
      },
    },
  },
};

/**
 * With State Management
 */
export const WithStateManagement: Story = {
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
    } = useChatPanelMock({
      initialMessages: inputStateMessages,
      approvalRequest: approvalQuestionRequest,
      reviewConfig: { allowedDecisions: ["approve", "reject"] },
      reviewMessages: reviewStateMessages,
      reviewFileChanges: sampleFileChanges,
      apiDelay: 800,
    });

    return (
      <ChatPanel
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
          "Interactive demonstration of the complete chat panel state management.",
      },
    },
  },
};
