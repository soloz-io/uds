"use client";

import * as React from "react";
import { AIConversation } from "@/components/blocks/AIConversation";
import { FileChangeQueue } from "@/components/blocks/FileChangeQueue";
import { PromptInput } from "@/components/composites/PromptInput";
import type { ToolCall } from "@/components/composites/ToolCallDisplay";
import type { SubAgent } from "@/components/composites/AgentIndicator";
import type { FileChangeData } from "@/components/composites/FileQueue";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
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

    // Handle approve action
    const handleApprove = React.useCallback(() => {
      setFileChangeState("approval-responded");
      setApproval({ approved: true });
      onApprove?.();
    }, [onApprove]);

    // Handle reject action
    const handleReject = React.useCallback(() => {
      setFileChangeState("approval-responded");
      setApproval({ approved: false });
      onReject?.();
    }, [onReject]);

    // Reset file change state when fileChanges are cleared
    React.useEffect(() => {
      if (fileChanges.length === 0) {
        setFileChangeState("approval-requested");
        setApproval({});
      }
    }, [fileChanges.length]);



    return (
      <div className={`relative flex h-full flex-col ${className || ""}`}>
        {/* Conversation Area - Handles scroll internally to keep input/file changes pinned at the bottom */}
        <AIConversation
          messages={messages}
          showAvatars={true}
          className="relative min-h-0 flex-1 overflow-y-auto"
        />

        {/* File Changes Queue (fixed at bottom, constrained height) */}
        {fileChanges.length > 0 && (
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
        )}

        {/* Input Area (visible only when no file changes to review) */}
        {fileChanges.length === 0 && (
          <div className="w-full flex-shrink-0">
            <PromptInput
              placeholder={placeholder}
              onSubmit={onSubmit}
              className="border-t"
            />
          </div>
        )}
      </div>
    );
  }
);

RefinementPanel.displayName = "RefinementPanel";
