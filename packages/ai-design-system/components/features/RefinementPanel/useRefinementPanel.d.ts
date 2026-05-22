/**
 * Hook Contract Definition for RefinementPanel
 * 
 * This file defines the interface contract between the design system and consuming applications.
 * It specifies the expected behavior of a real application hook without providing implementation.
 * 
 * Applications should implement this interface with real API calls and state management.
 * The design system provides a mock implementation (useRefinementPanel.mock.ts) for Storybook.
 */

import type { RefinementMessage } from "./RefinementPanel";
import type { FileChangeData } from "@/components/composites/FileQueue";

/**
 * Return type for the refinement panel hook
 * 
 * This interface defines what state and handlers the hook must provide
 * to integrate with the RefinementPanel component.
 */
export interface UseRefinementPanelReturn {
  /** Current conversation messages */
  messages: RefinementMessage[];
  
  /** File changes pending review */
  fileChanges: FileChangeData[];
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Handle user submission of refinement requests */
  handleSubmit: (prompt: string) => Promise<void> | void;
  
  /** Handle approval of all file changes */
  handleApprove: () => Promise<void> | void;
  
  /** Handle rejection of all file changes */
  handleReject: () => Promise<void> | void;
}

/**
 * Hook for managing refinement panel state and interactions
 * 
 * Applications should implement this hook to:
 * - Fetch and manage conversation messages
 * - Process user refinement requests via API
 * - Handle file change approval/rejection workflows
 * - Manage loading states during async operations
 * 
 * @example
 * ```tsx
 * // Real application implementation
 * export function useRefinementPanel(): UseRefinementPanelReturn {
 *   const [messages, setMessages] = useState<RefinementMessage[]>([]);
 *   const [fileChanges, setFileChanges] = useState<FileChangeData[]>([]);
 *   const [loading, setLoading] = useState(false);
 * 
 *   const handleSubmit = async (prompt: string) => {
 *     setLoading(true);
 *     try {
 *       const response = await api.submitRefinement(prompt);
 *       setMessages(response.messages);
 *       setFileChanges(response.fileChanges);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   // ... implement handleApprove and handleReject
 * 
 *   return { messages, fileChanges, loading, handleSubmit, handleApprove, handleReject };
 * }
 * ```
 */
export function useRefinementPanel(): UseRefinementPanelReturn;
