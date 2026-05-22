/**
 * Hook Contract Definition for SpecNavigator
 *
 * This file defines the interface contract between the SpecNavigator design system
 * component and consuming applications. Applications should implement this hook
 * to provide real data and state management for the SpecNavigator feature.
 *
 * @example
 * ```typescript
 * // Application implementation example
 * import { useSpecNavigator } from './hooks/useSpecNavigator';
 * import { SpecNavigator } from '@/components/features/SpecNavigator';
 *
 * function MySpecView() {
 *   const { groups, selectedFileId, loading, handleFileSelect } = useSpecNavigator();
 *
 *   if (loading) {
 *     return <div>Loading specifications...</div>;
 *   }
 *
 *   return (
 *     <SpecNavigator
 *       groups={groups}
 *       selectedFileId={selectedFileId}
 *       onFileSelect={handleFileSelect}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Real implementation with API integration
 * export function useSpecNavigator(): UseSpecNavigatorReturn {
 *   const [groups, setGroups] = useState<FileGroup[]>([]);
 *   const [selectedFileId, setSelectedFileId] = useState<string>();
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     async function fetchSpecs() {
 *       setLoading(true);
 *       try {
 *         const data = await api.getSpecifications();
 *         setGroups(transformToFileGroups(data));
 *       } catch (error) {
 *         console.error('Failed to load specs:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     }
 *     fetchSpecs();
 *   }, []);
 *
 *   const handleFileSelect = useCallback((fileId: string) => {
 *     setSelectedFileId(fileId);
 *     // Additional logic: navigate, load file content, etc.
 *   }, []);
 *
 *   return { groups, selectedFileId, loading, handleFileSelect };
 * }
 * ```
 */

import type { FileGroup } from "@/components/composites/FileQueue";

/**
 * Return type for the useSpecNavigator hook
 *
 * This interface defines the contract that application implementations must fulfill
 * to integrate with the SpecNavigator component.
 */
export interface UseSpecNavigatorReturn {
  /**
   * File groups to display in the navigator
   *
   * Each group represents a category of specification files (e.g., Instructions,
   * Agents, Toolbox, Triggers) with associated files. Groups should be ordered as they should
   * appear in the UI.
   */
  groups: FileGroup[];

  /**
   * ID of the currently selected file
   *
   * When set, the corresponding file in the navigator will be visually highlighted.
   * This should match the `id` property of a file within one of the groups.
   */
  selectedFileId?: string;

  /**
   * Loading state indicator
   *
   * When true, indicates that specification data is being fetched or processed.
   * Applications can use this to show loading states or disable interactions.
   */
  loading: boolean;

  /**
   * Handler for file selection events
   *
   * Called when a user selects a file in the navigator. Applications should
   * implement this to update the selected file state and perform any additional
   * actions (e.g., loading file content, navigation, analytics).
   *
   * @param fileId - The unique identifier of the selected file
   */
  handleFileSelect: (fileId: string) => void;
}

/**
 * Hook for managing spec navigator state and interactions
 *
 * Applications must implement this hook to provide data and state management
 * for the SpecNavigator component. The hook should handle:
 * - Fetching specification file data from APIs or local sources
 * - Managing file selection state
 * - Transforming raw data into FileGroup format
 * - Handling loading and error states
 *
 * @returns {UseSpecNavigatorReturn} Object containing groups, selection state, and handlers
 */
export function useSpecNavigator(): UseSpecNavigatorReturn;
