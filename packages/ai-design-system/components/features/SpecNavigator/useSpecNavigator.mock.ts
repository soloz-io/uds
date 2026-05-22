import { useState, useCallback } from "react";
import type { FileGroup } from "@/components/composites/FileQueue";

/**
 * Mock hook for SpecNavigator state management
 *
 * This mock simulates the behavior of a real application hook that would:
 * - Fetch specification files from an API or file system
 * - Manage file selection state
 * - Transform raw data into FileGroup format
 * - Handle loading states during data fetching
 *
 * Use this as a reference for implementing real application hooks.
 */
export interface UseSpecNavigatorReturn {
  /** File groups to display in the navigator */
  groups: FileGroup[];
  /** ID of the currently selected file */
  selectedFileId?: string;
  /** Loading state indicator */
  loading: boolean;
  /** Handler for file selection events */
  handleFileSelect: (fileId: string) => void;
}

export interface UseSpecNavigatorOptions {
  /** Initial file groups to display */
  initialGroups?: FileGroup[];
  /** Initial selected file ID */
  initialSelectedId?: string;
}

/**
 * Mock implementation of spec navigator state management
 *
 * This mock provides a simple state management implementation for Storybook
 * demonstrations. Real applications should implement the useSpecNavigator hook
 * with actual API integration, error handling, and more sophisticated state
 * management.
 *
 * @param options - Configuration for mock behavior
 * @returns State and handlers for spec navigation
 *
 * @example
 * ```typescript
 * // In a Storybook story
 * const { groups, selectedFileId, handleFileSelect } = useMockSpecNavigator({
 *   initialGroups: [
 *     {
 *       id: 'requirements',
 *       title: 'Requirements',
 *       files: [{ id: 'req1', name: 'requirements.md' }],
 *     },
 *   ],
 *   initialSelectedId: 'req1',
 * });
 *
 * return (
 *   <SpecNavigator
 *     groups={groups}
 *     selectedFileId={selectedFileId}
 *     onFileSelect={handleFileSelect}
 *   />
 * );
 * ```
 */
export function useSpecNavigatorMock(
  options: UseSpecNavigatorOptions = {}
): UseSpecNavigatorReturn {
  const { initialGroups = [], initialSelectedId } = options;

  const [groups] = useState<FileGroup[]>(initialGroups);
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>(
    initialSelectedId
  );
  const [loading] = useState(false);

  const handleFileSelect = useCallback((fileId: string) => {
    setSelectedFileId(fileId);
    // In a real implementation, this would also:
    // - Load file content from API
    // - Update URL/routing
    // - Track analytics
    // - Trigger side effects
  }, []);

  return {
    groups,
    selectedFileId,
    loading,
    handleFileSelect,
  };
}
