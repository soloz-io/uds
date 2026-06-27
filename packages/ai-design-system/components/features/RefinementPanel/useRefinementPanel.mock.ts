import { useState, useCallback } from "react";
import type { RefinementMessage } from "./RefinementPanel";
import type { FileChangeData } from "@/components/composites/FileQueue";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { ActionRequest, ReviewConfig } from "@/components/composites/ApprovalCard";
import type { ToolCall } from "@/components/composites/ToolCallDisplay";
import type { FormEvent } from "react";

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
  handleToolAction?: (toolCall: ToolCall, action: string) => void;
}

export interface UseRefinementPanelOptions {
  threadId?: string;
  initialMessages?: RefinementMessage[];
  reviewMessages?: RefinementMessage[];
  reviewFileChanges?: FileChangeData[];
  approvalRequest?: ActionRequest;
  reviewConfig?: ReviewConfig;
  apiDelay?: number;
}

export function useRefinementPanelMock(
  options: UseRefinementPanelOptions = {}
): UseRefinementPanelReturn {
  const {
    threadId,
    initialMessages = [],
    reviewMessages = [],
    reviewFileChanges = [],
    approvalRequest: initialApprovalRequest,
    reviewConfig,
    apiDelay = 800,
  } = options;

  if (threadId) {
    console.log(`[useRefinementPanelMock] threadId=${threadId} — history would be fetched from API in production`);
  }

  const [messages, setMessages] = useState<RefinementMessage[]>(initialMessages);
  const [fileChanges, setFileChanges] = useState<FileChangeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<ActionRequest | undefined>(initialApprovalRequest);
  const [isApprovalProcessing, setIsApprovalProcessing] = useState(false);

  const handleSubmit = useCallback(async (_prompt: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));

    if (initialApprovalRequest) {
      setApprovalRequest(initialApprovalRequest);
      setLoading(false);
    } else {
      setMessages(reviewMessages);
      setFileChanges(reviewFileChanges);
      setLoading(false);
    }
  }, [reviewMessages, reviewFileChanges, apiDelay, initialApprovalRequest]);

  const onSubmit = useCallback(async (message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
    await handleSubmit(message.text || '');
  }, [handleSubmit]);

  const handleApprovalApprove = useCallback(async () => {
    setIsApprovalProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));
    setApprovalRequest(undefined);
    setMessages(reviewMessages);
    setFileChanges(reviewFileChanges);
    setIsApprovalProcessing(false);
  }, [reviewMessages, reviewFileChanges, apiDelay]);

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
      ...reviewMessages.slice(prev.length),
    ]);
    setFileChanges(reviewFileChanges);
    setIsApprovalProcessing(false);
  }, [reviewMessages, reviewFileChanges, apiDelay]);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));
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

  const handleReject = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, apiDelay));
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
    handleToolAction: (toolCall, action) => console.log(`[Mock Tool Action] ${action} on tool:`, toolCall),
  };
}
