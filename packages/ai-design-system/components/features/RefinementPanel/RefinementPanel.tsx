"use client";

import * as React from "react";
import { AIConversation } from "@/components/blocks/AIConversation";
import { FileChangeQueue } from "@/components/blocks/FileChangeQueue";
import { PromptInput } from "@/components/blocks/PromptInput";
import { ApprovalCard } from "@/components/composites/ApprovalCard";
import type { ToolCall } from "@/components/composites/ToolCallDisplay";
import type { SubAgent } from "@/components/composites/AgentIndicator";
import type { FileChangeData } from "@/components/composites/FileQueue";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { ActionRequest, ReviewConfig, ToolUIState, ToolApproval } from "@/components/composites/ApprovalCard";
import type { FormEvent } from "react";

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
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
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
    placeholder = "Ask a question or describe a task...",
    className,
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
      setApprovalCardState("approval-responded");
      setApprovalCardApproval({ approved: true });
      onApprovalApprove?.();
    }, [onApprovalApprove]);

    // Handle reject for HITL approval request
    const handleApprovalReject = React.useCallback((reason: string) => {
      setApprovalCardState("approval-responded");
      setApprovalCardApproval({ approved: false });
      onApprovalReject?.(reason);
    }, [onApprovalReject]);

    // Handle edit for HITL approval request
    const handleApprovalEdit = React.useCallback((editedArgs: Record<string, unknown>) => {
      setApprovalCardState("approval-responded");
      setApprovalCardApproval({ approved: true });
      onApprovalEdit?.(editedArgs);
    }, [onApprovalEdit]);

    // Reset file change state when fileChanges are cleared
    React.useEffect(() => {
      if (fileChanges.length === 0) {
        setFileChangeState("approval-requested");
        setApproval({});
      }
    }, [fileChanges.length]);

    // Reset approval card state when approvalRequest is cleared
    React.useEffect(() => {
      if (!approvalRequest) {
        setApprovalCardState("approval-requested");
        setApprovalCardApproval({});
      }
    }, [approvalRequest]);



    // Construct dialog content that replaces the prompt input when active
    let dialog: React.ReactNode = null;

    if (approvalRequest) {
      dialog = (
        <div className="w-full flex-shrink-0 bg-background p-4">
          <ApprovalCard
            actionRequest={approvalRequest}
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
        <div className="w-full flex-shrink-0 border-t">
          <div className="max-h-[40vh] overflow-y-auto bg-background">
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
      <div className={`relative flex h-dvh flex-col ${className || ""}`}>
        <AIConversation
          messages={messages}
          showAvatars={true}
          className="relative min-h-0 flex-1 overflow-y-auto"
        />
        <PromptInput
          dialog={dialog}
          placeholder={placeholder}
          onSubmit={onSubmit}
          className="border-t"
        />
      </div>
    );
  }
);

RefinementPanel.displayName = "RefinementPanel";
