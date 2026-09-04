/**
 * Hook Contract Definition for ChatPanel
 * 
 * This file defines the interface contract between the design system and consuming applications.
 * It specifies the expected behavior of a real application hook without providing implementation.
 * 
 * Applications should implement this interface with real API calls and state management.
 * The design system provides a mock implementation (useChatPanel.mock.ts) for Storybook.
 */

import type { RefinementMessage } from "./ChatPanel";
import type { UserMessageAttachment } from "@/components/composites/UserMessage";
import type { FileChangeData } from "@/components/composites/FileQueue";
import type { ActionRequest, ReviewConfig } from "@/components/composites/ApprovalCard";
import type { ToolCall } from "@/components/composites/ToolCallDisplay";
import type { FileDownloadResult } from "@/components/composites/FileTreeExplorer";
import type { UseChatPanelOptions } from "./useChatPanel.mock";

/**
 * Generic submit-request shape for handleSubmit below — deliberately loose
 * (not importing an app-specific attachment domain type here, since this
 * package stays app-agnostic) but structurally compatible with a consuming
 * app's own richer attachment type (e.g. Waypoint's MessageAttachment[]).
 */
export interface ChatSubmitInput {
  text: string;
  attachments?: UserMessageAttachment[];
}

/**
 * Return type for the chat panel hook
 *
 * This interface defines what state and handlers the hook must provide
 * to integrate with the ChatPanel component.
 */
export interface UseChatPanelReturn {
  /** Current conversation messages */
  messages: RefinementMessage[];
  
  /** File changes pending review */
  fileChanges: FileChangeData[];
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Stop / cancel active agent turn */
  onStop?: () => void;
  
  /** Handle user submission of chat requests */
  handleSubmit: (input: ChatSubmitInput) => Promise<void> | void;
  
  /** Handle approval of all file changes */
  handleApprove: () => Promise<void> | void;
  
  /** Handle rejection of all file changes */
  handleReject: () => Promise<void> | void;

  /** HITL approval request (when agent pauses for human input via interrupt) */
  approvalRequest?: ActionRequest;

  /** Review configuration for HITL approval */
  reviewConfig?: ReviewConfig;

  /** Handle approval of HITL approval request (ask_user approve) */
  handleAskUserApprove?: () => Promise<void> | void;

  /** Handle rejection of HITL approval request */
  handleAskUserReject?: (reason: string) => Promise<void> | void;

  /** Processing state for HITL approval */
  isApprovalProcessing?: boolean;

  /** Action handler for tool interactions */
  handleToolAction?: (toolCall: ToolCall, action: string) => void;

  /** Handler to download the session chat history */
  handleDownloadSession?: () => Promise<FileDownloadResult | undefined>;

  /** Handler to restore conversation to a prior checkpoint */
  handleRestoreCheckpoint?: (messageId: string, checkpointId: string) => Promise<void> | void;
}

export function useChatPanel(options?: UseChatPanelOptions): UseChatPanelReturn;
