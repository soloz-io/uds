"use client";

import * as React from "react";
import { AIConversation } from "@/components/blocks/AIConversation";
import { FileChangeQueue } from "@/components/blocks/FileChangeQueue";
import { PromptInput } from "@/components/composites/PromptInput";
import { ApprovalCard } from "@/components/composites/ApprovalCard";
import type { ToolCall } from "@/components/composites/ToolCallDisplay";
import type { SubAgent } from "@/components/composites/AgentIndicator";
import type { FileChangeData } from "@/components/composites/FileQueue";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { ActionRequest, ReviewConfig, ToolUIState, ToolApproval } from "@/components/composites/ApprovalCard";
import type { FormEvent } from "react";
import { SessionHeader } from "@/components/composites/SessionHeader";
import type { ChatSessionInfo } from "@/components/composites/SessionHeader";
import { exportMessagesToMarkdownFile, type ExportableMessage } from "@/utils/markdown-formatter";
import type { FileDownloadResult } from "@/components/composites/FileTreeExplorer";

/**
 * RefinementPanel Feature
 *
 * A two-state feature component for AI-powered code refinement workflows.
 * Enables users to submit refinement requests and review multi-agent generated changes.
 *
 * States:
 * - input: Clean interface for submitting refinement requests
 * - multi-agent-review: Complex interface showing agent conversations and file changes
 */

/**
 * Message data structure for conversation display
 */
export interface RefinementMessage {
  id: string;
  type: "human" | "ai";
  role: "user" | "orchestrator" | "specialist" | "system";
  content: string;
  avatarSrc?: string;
  avatarName?: string;
  toolCalls?: ToolCall[];
  subAgents?: SubAgent[];
  isLoading?: boolean;
  checkpointId?: string;
}

/**
 * ChatPanel component props
 */
export interface ChatPanelProps {
  /**
   * Conversation messages to display
   */
  messages: RefinementMessage[];
  /**
   * File changes to review
   */
  fileChanges?: FileChangeData[];
  /**
   * Submit handler for user input
   */
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void;
  /**
   * Handler to approve file changes
   */
  onApprove?: () => void;
  /**
   * Handler to reject file changes
   */
  onReject?: () => void;
  /**
   * Active HITL approval request (from tool execution or ask_user)
   */
  approvalRequest?: ActionRequest;
  /**
   * Review config for allowed decisions
   */
  reviewConfig?: ReviewConfig;
  /**
   * Handler to approve HITL approval request
   */
  onApprovalApprove?: () => void;
  /**
   * Handler to reject HITL approval request
   */
  onApprovalReject?: (reason: string) => void;
  /**
   * Handler to edit HITL approval request arguments
   */
  onApprovalEdit?: (editedArgs: Record<string, unknown>) => void;
  /**
   * Processing state for HITL approval request
   */
  isApprovalProcessing?: boolean;
  /**
   * Loading state for user input submission
   */
  loading?: boolean;
  /**
   * Handler to cancel / stop active agent execution
   */
  onStop?: () => void;
  /**
   * Placeholder text for prompt input
   */
  placeholder?: string;
  /**
   * Controlled draft prompt value (e.g. set programmatically to inject a
   * screenshot markdown image). When provided with onPromptValueChange the
   * PromptInput becomes fully controlled.
   */
  promptValue?: string;
  /**
   * Controlled draft prompt change handler.
   */
  onPromptValueChange?: (value: string) => void;
  /**
   * Custom className for container
   */
  className?: string;
  /**
   * Callback when a tool action is clicked in ToolCallDisplay
   */
  onToolAction?: (toolCall: ToolCall, action: string) => void;
  /**
   * List of chat sessions for session switching
   */
  sessions?: ChatSessionInfo[];
  /**
   * Currently active session ID
   */
  activeSessionId?: string | null;
  /**
   * Handler to start a new session
   */
  onNewSession?: () => void;
  /**
   * Handler to close the active session
   */
  onCloseSession?: (id: string) => void;
  /**
   * Handler to switch sessions
   */
  onSelectSession?: (id: string) => void;
  /**
   * Handler to download the session chat history
   */
  onDownloadSession?: () => Promise<FileDownloadResult | undefined>;
  /**
   * Custom renderer for system messages.
   * Receives the raw content string and returns a ReactNode.
   */
  renderSystemMessage?: (content: string) => React.ReactNode;
  /**
   * Callback fired when user restores a conversation checkpoint
   */
  onRestoreCheckpoint?: (messageId: string, checkpointId: string) => void;
}

/**
 * ChatPanel component - chat workflow interface
 */
export const ChatPanel = React.memo<ChatPanelProps>(
  ({
    messages,
    fileChanges = [],
    onSubmit,
    onApprove,
    onReject,
    approvalRequest,
    reviewConfig,
    onApprovalApprove,
    onApprovalReject,
    onApprovalEdit,
    isApprovalProcessing = false,
    loading = false,
    onStop,
    placeholder = "Ask a question or describe a task...",
    promptValue,
    onPromptValueChange,
    className,
    onToolAction,
    sessions,
    activeSessionId,
    onNewSession,
    onCloseSession,
    onSelectSession,
    onDownloadSession,
    renderSystemMessage,
    onRestoreCheckpoint,
  }) => {
    // File change queue state
    const [fileChangeState, setFileChangeState] = React.useState<
      "approval-requested" | "approval-responded"
    >("approval-requested");
    const [approval, setApproval] = React.useState<
      { approved?: boolean }
    >({});

    // HITL approval card state
    const [approvalCardState, setApprovalCardState] = React.useState<ToolUIState>("approval-requested");
    const [approvalCardApproval, setApprovalCardApproval] = React.useState<ToolApproval>({});

    // Handle approve action for file changes
    const handleApprove = React.useCallback(() => {
      setFileChangeState("approval-responded");
      setApproval({ approved: true });
      onApprove?.();
    }, [onApprove]);

    // Handle reject action for file changes
    const handleReject = React.useCallback(() => {
      setFileChangeState("approval-responded");
      setApproval({ approved: false });
      onReject?.();
    }, [onReject]);

    // Pending ask_user question extracted from approvalRequest args
    const pendingAskUser = React.useMemo(() => {
      if (approvalRequest?.name === "ask_user" && approvalRequest.args.question) {
        return {
          question: approvalRequest.args.question as string,
          options: approvalRequest.args.options as string[] | undefined,
        };
      }
      return null;
    }, [approvalRequest]);

    // Active approval request derived from props or pending ask_user
    const activeApprovalRequest = React.useMemo<ActionRequest | undefined>(() => {
      if (approvalRequest) return approvalRequest;
      if (pendingAskUser) {
        return {
          name: "ask_user",
          args: {
            question: pendingAskUser.question,
            options: pendingAskUser.options,
          },
          description: pendingAskUser.question,
        };
      }
      return undefined;
    }, [approvalRequest, pendingAskUser]);

    // Handle approve for HITL approval request
    const handleApprovalApprove = React.useCallback(() => {
      if (activeApprovalRequest?.name === "ask_user") {
        const dummyEvent = { preventDefault: () => { } } as React.FormEvent<HTMLFormElement>;
        onSubmit({ text: "Approved", files: [] }, dummyEvent);
      } else {
        onApprovalApprove?.();
      }
    }, [onApprovalApprove, activeApprovalRequest, onSubmit]);

    // Handle reject for HITL approval request
    const handleApprovalReject = React.useCallback((reason: string) => {
      if (activeApprovalRequest?.name === "ask_user") {
        const dummyEvent = { preventDefault: () => { } } as React.FormEvent<HTMLFormElement>;
        onSubmit({ text: "Skipped", files: [] }, dummyEvent);
      } else {
        onApprovalReject?.(reason);
      }
    }, [onApprovalReject, activeApprovalRequest, onSubmit]);

    // Handle edit for HITL approval request
    const handleApprovalEdit = React.useCallback((editedArgs: Record<string, unknown>) => {
      if (activeApprovalRequest?.name === "ask_user" && editedArgs.answers) {
        const answers = Array.isArray(editedArgs.answers) ? editedArgs.answers : [editedArgs.answers];
        const text = answers.join(', ');
        const dummyEvent = { preventDefault: () => { } } as React.FormEvent<HTMLFormElement>;
        onSubmit({ text, files: [] }, dummyEvent);
      } else {
        onApprovalEdit?.(editedArgs);
      }
    }, [onApprovalEdit, activeApprovalRequest, onSubmit]);

    // Reset file change state when fileChanges are cleared
    React.useEffect(() => {
      if (fileChanges.length === 0) {
        setFileChangeState("approval-requested");
        setApproval({});
      }
    }, [fileChanges.length]);

    // Reset approval card state when activeApprovalRequest is cleared
    React.useEffect(() => {
      if (!activeApprovalRequest) {
        setApprovalCardState("approval-requested");
        setApprovalCardApproval({});
      }
    }, [activeApprovalRequest]);

    // Construct dialog content that replaces the prompt input when active
    let dialog: React.ReactNode = null;

    if (activeApprovalRequest) {
      dialog = (
        <div className="w-full flex-shrink-0">
          <ApprovalCard
            actionRequest={activeApprovalRequest}
            reviewConfig={reviewConfig}
            onApprove={handleApprovalApprove}
            onReject={handleApprovalReject}
            onEdit={handleApprovalEdit}
            isProcessing={isApprovalProcessing}
            state={approvalCardState}
            approval={approvalCardApproval}
          />
        </div>
      );
    } else if (fileChanges.length > 0) {
      dialog = (
        <div className="w-full flex-shrink-0">
          <div className="max-h-[40vh] overflow-y-auto bg-card rounded-2xl border shadow-sm overflow-hidden p-2">
            <FileChangeQueue
              changes={fileChanges}
              title="Review and approve these file changes"
              state={fileChangeState}
              approval={approval}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>
      );
    }

    const isAgentRunning = React.useMemo(() => {
      if (loading) return true;
      return messages.some(
        (m) =>
          m.subAgents?.some((sa) => sa.status === "active" || sa.status === "pending" || sa.status === "running" || sa.status === "in_progress") ||
          m.toolCalls?.some((tc) => tc.status === "pending" || tc.status === "running" || tc.status === "in_progress" || tc.status === "active")
      );
    }, [loading, messages]);

    return (
      <div className={`relative flex h-full flex-col ${className || ""}`}>
        {/* Chat Session Header */}
        <SessionHeader
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewSession={onNewSession}
          onCloseSession={onCloseSession}
          onSelectSession={onSelectSession}
          onDownloadSession={onDownloadSession || (async () => exportMessagesToMarkdownFile(messages as ExportableMessage[]))}
        />

        <AIConversation
          messages={messages}
          showAvatars={true}
          onToolAction={onToolAction}
          renderSystemMessage={renderSystemMessage}
          onRestoreCheckpoint={onRestoreCheckpoint}
          className="flex-1 min-h-0"
        />
        <div className="sticky bottom-0 z-10 p-4 bg-gradient-to-t from-card via-card to-transparent pt-6">
          <PromptInput
            dialog={dialog}
            placeholder={placeholder}
            value={promptValue}
            onChange={onPromptValueChange}
            onSubmit={onSubmit}
            loading={isAgentRunning}
            onStop={onStop}
            className="rounded-2xl border border-neutral-600 bg-background shadow-sm overflow-hidden"
          />
        </div>
      </div>
    );
  }
);

ChatPanel.displayName = "ChatPanel";
