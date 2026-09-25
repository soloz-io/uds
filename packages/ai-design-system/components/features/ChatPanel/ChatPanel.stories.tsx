import type { Meta, StoryObj } from "@storybook/react";
import { ChatPanel, type RefinementMessage } from "./ChatPanel";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { UserMessageAttachment } from "@/components/composites/UserMessage";
import { useChatPanelMock } from "./useChatPanel.mock";
import {
  inputStateMessages,
  reviewStateMessages,
  attachmentStateMessages,
  sampleFileChanges,
  approvalQuestionRequest,
  approvalMultiQuestionRequest,
  sampleRunningTasks,
  sampleMultipleTasks,
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
      handleRestoreCheckpoint,
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
        onRestoreCheckpoint={handleRestoreCheckpoint}
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

/**
 * With Running Task — Recreates 2.1-jobs.png bottom panel with TaskQueue docked flush above PromptInput.
 */
export const WithRunningTask: Story = {
  args: {
    messages: inputStateMessages,
    tasks: sampleRunningTasks,
    placeholder: "Ask anything, @ to mention, / for actions",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submitted:", message);
    },
    onTaskStop: (id: string) => {
      console.log(`Stopped task ${id}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "ChatPanel displaying an active background running task (npm install) docked directly above PromptInput, reproducing the antigravity inspiration from 2.1-jobs.png.",
      },
    },
  },
};

/**
 * With Multiple Tasks — Running task and queued tasks docked above PromptInput.
 */
export const WithMultipleTasks: Story = {
  args: {
    messages: inputStateMessages,
    tasks: sampleMultipleTasks,
    placeholder: "Ask anything, @ to mention, / for actions",
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submitted:", message);
    },
    onTaskStop: (id: string) => {
      console.log(`Stopped task ${id}`);
    },
    onTaskCancel: (id: string) => {
      console.log(`Cancelled task ${id}`);
    },
    onTaskStopAll: () => {
      console.log("Stopped all tasks");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "ChatPanel displaying multiple running and queued tasks docked directly above PromptInput.",
      },
    },
  },
};

/**
 * With Speech Input — PromptInput featuring SpeechInput (5-second voice note) and file attachment.
 * Matches the latest design system PromptInput specification.
 */
export const WithSpeechInput: Story = {
  args: {
    messages: inputStateMessages,
    placeholder: "What would you like to know?",
    enableSpeech: true,
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submitted:", message);
      alert(`Submitted: ${message.text}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "ChatPanel with PromptInput featuring a 5-second voice-note SpeechInput, file attachment picker, and submit button matching the new UI layout.",
      },
    },
  },
};

/**
 * With Speech Input and Active Tasks — Shows docked TaskQueue flush atop the updated PromptInput with SpeechInput.
 */
export const WithSpeechInputAndTasks: Story = {
  args: {
    messages: inputStateMessages,
    tasks: sampleRunningTasks,
    placeholder: "What would you like to know?",
    enableSpeech: true,
    onSubmit: (message: PromptInputMessage) => {
      console.log("Submitted:", message);
      alert(`Submitted: ${message.text}`);
    },
    onTaskStop: (id: string) => {
      console.log(`Stopped task ${id}`);
    },
    onTaskCancel: (id: string) => {
      console.log(`Cancelled task ${id}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Docked TaskQueue flush atop the PromptInput with voice speech input and file attachment.",
      },
    },
  },
};

/**
 * With Image and Audio Attachments — proves both attachment kinds render
 * inline on a user message inside a real ChatPanel:
 *
 * 1. Seeded message: an image thumbnail (size-20) plus a playable
 *    <audio controls> voice note rendered by UserMessageAttachments.
 * 2. Live round-trip: attach an image via the paperclip or record a 5s
 *    voice note via the mic, submit, and the just-sent message renders the
 *    same way (submitted files are mapped to UserMessage attachments
 *    exactly as each app's toMessageAttachments does).
 */
export const WithImageAndAudioAttachments: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<RefinementMessage[]>(
      attachmentStateMessages
    );

    const onSubmit = (message: PromptInputMessage) => {
      const files = message.files ?? [];
      const attachments: UserMessageAttachment[] = files.map((file) => ({
        id: file.id,
        kind: file.mediaType?.startsWith("audio/") ? "audio" : "image",
        mime: file.mediaType ?? "application/octet-stream",
        filename: file.filename,
        source: {
          type: file.url?.startsWith("data:") ? "data" : "url",
          value: file.url ?? "",
        },
      }));
      const now = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${now}`,
          type: "human",
          role: "user",
          content: message.text || "(no text)",
          avatarSrc:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
          avatarName: "User",
          ...(attachments.length ? { attachments } : {}),
        },
      ]);
      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `local-reply-${now}`,
            type: "ai",
            role: "orchestrator",
            content: files.length
              ? `Received ${files.length} attachment(s): ${files
                  .map((file) => file.filename ?? file.mediaType ?? "file")
                  .join(", ")}. Images and voice notes render inline on your message.`
              : "Received — attach an image or record a voice note to see both render inline.",
            avatarSrc:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
            avatarName: "Coordinator",
          },
        ]);
      }, 500);
    };

    return (
      <ChatPanel
        messages={messages}
        enableSpeech
        placeholder="Attach an image or record a 5s voice note, then send..."
        onSubmit={onSubmit}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "ChatPanel proving image AND audio attachments render on user messages: a seeded message with an image thumbnail and a playable audio player, plus a live round-trip — paperclip/voice-note → submit → both kinds render on the just-sent message.",
      },
    },
  },
};


