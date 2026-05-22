/**
 * RefinementPanel Feature
 *
 * Export point for the RefinementPanel feature component and related utilities.
 * 
 * Component:
 * - RefinementPanel: Main feature component for refinement workflows
 * 
 * Hook Contract:
 * - useRefinementPanel: Interface definition for application hooks (implement in your app)
 * - UseRefinementPanelReturn: Return type for the hook
 * 
 * Mock Utilities (for testing/development):
 * - useMockRefinementPanel: Mock implementation for Storybook
 */

export { RefinementPanel } from "./RefinementPanel";
export type { RefinementPanelProps, RefinementMessage } from "./RefinementPanel";

// Hook contract definition (implement in your application)
export type { UseRefinementPanelReturn } from "./useRefinementPanel.d";

// Mock hook for testing and development
export { useRefinementPanelMock as useMockRefinementPanel } from "./useRefinementPanel.mock";
export type { UseRefinementPanelOptions } from "./useRefinementPanel.mock";
