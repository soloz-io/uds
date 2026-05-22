import { useState, useCallback } from "react";
import type { RefinementMessage } from "./RefinementPanel";
import type { FileChangeData } from "@/components/composites/FileQueue";

/**
 * Mock hook for RefinementPanel state management
 * 
 * This mock simulates the behavior of a real application hook that would:
 * - Manage conversation messages
 * - Handle file changes from agent processing
 * - Process user submissions
 * - Handle approval/rejection workflows
 * 
 * Use this as a reference for implementing real application hooks.
 */
export interface UseRefinementPanelReturn {
  messages: RefinementMessage[];
  fileChanges: FileChangeData[];
  loading: boolean;
  handleSubmit: (prompt: string) => Promise<void>;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
}

export interface UseRefinementPanelOptions {
  initialMessages?: RefinementMessage[];
  reviewMessages?: RefinementMessage[];
  reviewFileChanges?: FileChangeData[];
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
    apiDelay = 800,
  } = options;

  const [messages, setMessages] = useState<RefinementMessage[]>(initialMessages);
  const [fileChanges, setFileChanges] = useState<FileChangeData[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate submission: transition to review state with agent processing
  const handleSubmit = useCallback(async (_prompt: string) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, apiDelay));

    // Transition to review state with agent messages and file changes
    setMessages(reviewMessages);
    setFileChanges(reviewFileChanges);
    setLoading(false);
  }, [reviewMessages, reviewFileChanges, apiDelay]);

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
    handleApprove,
    handleReject,
  };
}
