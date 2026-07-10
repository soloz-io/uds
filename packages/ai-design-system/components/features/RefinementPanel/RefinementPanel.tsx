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
  role: "user" | "orchestrator" | "specialist";
  content: string;
  avatarSrc?: string;
  avatarName?: string;
  toolCalls?: ToolCall[];
  subAgents?: SubAgent[];
  isLoading?: boolean;
}

/**
 * RefinementPanel component props
 */
export interface RefinementPanelProps {
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
  ) => void | Promise<void>;
  /**
   * Approve handler for file changes
   */
  onApprove?: () => void;
  /**
   * Reject handler for file changes
   */
  onReject?: () => void;
  /**
   * HITL approval request (when agent pauses for human input via interrupt)
   */
  approvalRequest?: ActionRequest;
  /**
   * Review configuration for HITL approval (allowed decisions)
   */
  reviewConfig?: ReviewConfig;
  /**
   * Approve handler for HITL approval request
   */
  onApprovalApprove?: () => void;
  /**
   * Reject handler for HITL approval request
   */
  onApprovalReject?: (reason: string) => void;
  /**
   * Edit handler for HITL approval request
   */
  onApprovalEdit?: (editedArgs: Record<string, unknown>) => void;
  /**
   * Processing state for HITL approval
   */
  isApprovalProcessing?: boolean;
  /**
   * Loading state — shows spinner on send button while streaming
   */
  loading?: boolean;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Action handler for tool interactions
   */
  onToolAction?: (toolCall: ToolCall, action: string) => void;
  /**
   * Available chat sessions
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
}

/**
 * RefinementPanel component - two-state refinement workflow interface
 */
export const RefinementPanel = React.memo<RefinementPanelProps>(
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
    placeholder = "Ask a question or describe a task...",
    className,
    onToolAction,
    sessions,
    activeSessionId,
    onNewSession,
    onCloseSession,
    onSelectSession,
    onDownloadSession,
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

    // Handle approve for HITL approval request
    const handleApprovalApprove = React.useCallback(() => {
      onApprovalApprove?.();
    }, [onApprovalApprove]);

    // Extract pending ask_user tool call from messages
    const pendingAskUser = React.useMemo(() => {
      console.log("[RefinementPanel] Messages length:", messages.length);
      // Look from the end
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.toolCalls && msg.toolCalls.length > 0) {
          console.log(`[RefinementPanel] Message ${i} (${msg.id}) has ${msg.toolCalls.length} tool calls`, msg.toolCalls.map(tc => `${tc.name} [${tc.status}]`));
          const askUserTc = msg.toolCalls.find(tc => tc.name === "ask_user" && tc.status === "pending");
          if (askUserTc) {
            console.log("[RefinementPanel] Found pending ask_user:", askUserTc);
            return askUserTc;
          }
        }
      }
      return null;
    }, [messages]);

    const activeApprovalRequest = React.useMemo(() => {
      if (approvalRequest) return approvalRequest;
      if (pendingAskUser) {
        console.log("[RefinementPanel] ask_user args:", JSON.stringify(pendingAskUser.args));
        return {
          name: pendingAskUser.name,
          args: pendingAskUser.args,
        };
      }
      return undefined;
    }, [approvalRequest, pendingAskUser]);

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
        <div className="w-full flex-shrink-0 bg-card p-4 rounded-2xl border shadow-sm overflow-hidden">
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

    return (
      <div className={`relative flex h-full flex-col ${className || ""}`}>
        {/* Chat Session Header */}
        <SessionHeader
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewSession={onNewSession}
          onCloseSession={onCloseSession}
          onSelectSession={onSelectSession}
          onDownloadSession={onDownloadSession}
        />

        <AIConversation
          messages={messages}
          showAvatars={true}
          onToolAction={onToolAction}
          className="flex-1 min-h-0"
        />
        <div className="sticky bottom-0 z-10 p-4 bg-gradient-to-t from-card via-card to-transparent pt-6">
          <PromptInput
            dialog={dialog}
            placeholder={placeholder}
            onSubmit={onSubmit}
            loading={loading}
            className="rounded-2xl border border-neutral-600 bg-background shadow-sm overflow-hidden"
          />
        </div>
      </div>
    );
  }
);

RefinementPanel.displayName = "RefinementPanel";
