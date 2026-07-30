/**
 * ChatPanel Feature
 *
 * Export point for the ChatPanel feature component and related utilities.
 * 
 * Component:
 * - ChatPanel: Main feature component for chat workflows
 * 
 * Hook Contract:
 * - useChatPanel: Interface definition for application hooks (implement in your app)
 * - UseChatPanelReturn: Return type for the hook
 * 
 * Mock Utilities (for testing/development):
 * - useMockChatPanel: Mock implementation for Storybook
 */

export { ChatPanel } from "./ChatPanel";
export type { ChatPanelProps, RefinementMessage } from "./ChatPanel";

// HITL types (re-exported from ApprovalCard for consumer convenience)
export type { ActionRequest, ReviewConfig } from "@/components/composites/ApprovalCard";

// Hook contract definition (implement in your application)
export type { UseChatPanelReturn } from "./useChatPanel.d";

// Mock hook for testing and development
export { useChatPanelMock as useMockChatPanel } from "./useChatPanel.mock";
export type { UseChatPanelOptions } from "./useChatPanel.mock";
