import { useState, useCallback } from "react";
import type { RefinementMessage } from "./RefinementPanel";
import type { FileChangeData } from "@/components/composites/FileQueue";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { ActionRequest, ReviewConfig } from "@/components/composites/ApprovalCard";
import type { FormEvent } from "react";

/**
 * Mock hook for RefinementPanel state management
 * 
 * This mock simulates the behavior of a real application hook that would:
 * - Manage conversation messages
 * - Handle file changes from agent processing
 * - Process user submissions
 * - Handle approval/rejection workflows
 * - Handle HITL approval requests (interactive questions)
 * 
 * Use this as a reference for implementing real application hooks.
 */
export interface UseRefinementPanelReturn {
  messages: RefinementMessage[];
  fileChanges: FileChangeData[];
  loading: boolean;
  handleSubmit: (prompt: string) => Promise<void>;
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  approvalRequest?: ActionRequest;
  reviewConfig?: ReviewConfig;
  handleApprovalApprove?: () => Promise<void>;
  handleApprovalReject?: (reason: string) => Promise<void>;
  handleApprovalEdit?: (editedArgs: Record<string, unknown>) => Promise<void>;
  isApprovalProcessing?: boolean;
}

export interface UseRefinementPanelOptions {
  initialMessages?: RefinementMessage[];
  reviewMessages?: RefinementMessage[];
  reviewFileChanges?: FileChangeData[];
  /** Optional HITL approval request to show before file changes */
  approvalRequest?: ActionRequest;
  /** Review configuration for HITL approval */
  reviewConfig?: ReviewConfig;
  apiDelay?: number;
}

/**
 * Mock implementation of refinement panel state management
 * 
 * @param options - Configuration for mock behavior
 * @returns State and handlers for refinement workflow
 */
export function useRefinementPanelMock(
  options: UseRefinementPanelOptions = {}
): UseRefinementPanelReturn {
  const {
    initialMessages = [],
    reviewMessages = [],
    reviewFileChanges = [],
    approvalRequest: initialApprovalRequest,
    reviewConfig,
    apiDelay = 800,
  } = options;

  const [messages, setMessages] = useState<RefinementMessage[]>(initialMessages);
  const [fileChanges, setFileChanges] = useState<FileChangeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<ActionRequest | undefined>(initialApprovalRequest);
  const [isApprovalProcessing, setIsApprovalProcessing] = useState(false);

  // Simulate submission: transition to HITL state (if approvalRequest configured) or review state
  const handleSubmit = useCallback(async (_prompt: string) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, apiDelay));

    if (initialApprovalRequest) {
      // Go to HITL approval state first
      setApprovalRequest(initialApprovalRequest);
      setLoading(false);
    } else {
      // Skip directly to review state with agent messages and file changes
      setMessages(reviewMessages);
      setFileChanges(reviewFileChanges);
      setLoading(false);
    }
  }, [reviewMessages, reviewFileChanges, apiDelay, initialApprovalRequest]);

  const onSubmit = useCallback(async (message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
    await handleSubmit(message.text || '');
  }, [handleSubmit]);

  // Simulate HITL approval: clear approval, proceed to file changes
  const handleApprovalApprove = useCallback(async () => {
    setIsApprovalProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));
    setApprovalRequest(undefined);
    setMessages(reviewMessages);
    setFileChanges(reviewFileChanges);
    setIsApprovalProcessing(false);
  }, [reviewMessages, reviewFileChanges, apiDelay]);

  // Simulate HITL rejection: clear approval, add rejection message
  const handleApprovalReject = useCallback(async (_reason: string) => {
    setIsApprovalProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));
    setApprovalRequest(undefined);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "ai",
        role: "orchestrator",
        content: "❌ Request was rejected. Let me adjust the approach.",
        avatarSrc:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        avatarName: "Coordinator",
      },
    ]);
    setIsApprovalProcessing(false);
  }, [apiDelay]);

  // Simulate HITL edit: clear approval, add edited message, proceed to file changes
  const handleApprovalEdit = useCallback(async (_editedArgs: Record<string, unknown>) => {
    setIsApprovalProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));
    setApprovalRequest(undefined);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "ai",
        role: "orchestrator",
        content: "✏️ Request was edited and approved. Processing with updated parameters...",
        avatarSrc:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        avatarName: "Coordinator",
      },
    ]);
    setFileChanges(reviewFileChanges);
    setIsApprovalProcessing(false);
  }, [reviewFileChanges, apiDelay]);

  // Simulate approval: clear file changes and add success message
  const handleApprove = useCallback(async () => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, apiDelay));

    // Add success message and clear file changes
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "ai",
        role: "orchestrator",
        content: "✅ Changes approved and applied successfully!",
        avatarSrc:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        avatarName: "Coordinator",
      },
    ]);
    setFileChanges([]);
    setLoading(false);
  }, [apiDelay]);

  // Simulate rejection: clear file changes and add rejection message
  const handleReject = useCallback(async () => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, apiDelay));

    // Add rejection message and clear file changes
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "ai",
        role: "orchestrator",
        content: "❌ Changes rejected. Let me know how to improve them.",
        avatarSrc:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        avatarName: "Coordinator",
      },
    ]);
    setFileChanges([]);
    setLoading(false);
  }, [apiDelay]);

  return {
    messages,
    fileChanges,
    loading,
    handleSubmit,
    onSubmit,
    handleApprove,
    handleReject,
    approvalRequest,
    reviewConfig,
    handleApprovalApprove: initialApprovalRequest ? handleApprovalApprove : undefined,
    handleApprovalReject: initialApprovalRequest ? handleApprovalReject : undefined,
    handleApprovalEdit: initialApprovalRequest ? handleApprovalEdit : undefined,
    isApprovalProcessing,
  };
}
