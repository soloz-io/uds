/**
 * Blocks
 *
 * Central export point for all block components.
 * Blocks are composite components that extend AI elements with enhanced functionality.
 */

// ToolCallDisplay Block
export { ToolCallDisplay } from './ToolCallDisplay'
export type { ToolCallDisplayProps, ToolCall } from './ToolCallDisplay'

// AgentIndicator Block
export { AgentIndicator } from './AgentIndicator'
export type { AgentIndicatorProps, SubAgent } from './AgentIndicator'

// UserMessage Block
export { UserMessage } from './UserMessage'
export type { UserMessageProps, UserMessageData } from './UserMessage'

// SpecialistMessage Block
export { SpecialistMessage } from './SpecialistMessage'
export type { SpecialistMessageProps, SpecialistMessageData } from './SpecialistMessage'

// OrchestratorMessage Block
export { OrchestratorMessage } from './OrchestratorMessage'
export type { OrchestratorMessageProps, OrchestratorMessageData } from './OrchestratorMessage'

// PromptInput Block
export { PromptInput } from './PromptInput'
export type { PromptInputBlockProps } from './PromptInput'

// FileQueue Block
export { FileQueue, FileStatusBadge } from './FileQueue'
export type { FileQueueProps, FileChangeData, FileStatusBadgeProps, FileStatus } from './FileQueue'

// FilePreviewDialog Composite
export { FilePreviewDialog } from './FilePreviewDialog'
export type { FilePreviewDialogProps } from './FilePreviewDialog'

// Confirmation Block
export { Confirmation } from './Confirmation'
export type { ConfirmationProps } from './Confirmation'

// CommentBox Block
export { CommentBox } from './CommentBox'
export type { CommentBoxProps } from '@/types/ai-editor'

// DocumentEditor Block
export { DocumentEditor } from './DocumentEditor'
export type { DocumentEditorProps } from '@/types/ai-editor'

// ModeToggle Composite
export { ModeToggle } from './ModeToggle'
export type { ModeToggleProps } from './ModeToggle'

// DocumentTabBar Composite
export { DocumentTabBar } from './DocumentTabBar'
export type { DocumentTabBarProps } from './DocumentTabBar'

// ThemeSelector Composite
export { ThemeSelector } from './ThemeSelector'
export type { ThemeSelectorProps, Theme } from './ThemeSelector'

// TablePagination Composite
export { TablePagination } from './TablePagination'
export type { TablePaginationProps } from './TablePagination'

// TableToolbar Composite
export { TableToolbar } from './TableToolbar'
export type { TableToolbarProps } from './TableToolbar'

// StatsCard Composite
export { StatsCard } from './StatsCard'
export type { StatsCardProps } from './StatsCard'

// NavigationList Composite
export { NavigationList } from './NavigationList'
export type { NavigationListProps, NavigationItem } from './NavigationList'

// NavUser Composite
export { NavUser } from './NavUser'
export type { NavUserProps } from './NavUser'

// AppHeader Composite
export { AppHeader } from './AppHeader'
export type { AppHeaderProps } from './AppHeader'

// InteractiveChart Composite
export { InteractiveChart } from './InteractiveChart'
export type { InteractiveChartProps } from './InteractiveChart'

// DataTable Composite
export { DataTable } from './DataTable'
export type { DataTableProps } from './DataTable'
export { EnhancedDataTable } from './DataTable'
export type { EnhancedDataTableProps, DashboardRow } from './DataTable'

// FormReports Composite
export { FormReportsDrawerForm, FormReportsTable } from './FormReports'
export type {
	FormReportsColumn,
	FormReportsDrawerFormProps,
	FormReportsEntity,
	FormReportsFieldDefinition,
	FormReportsFieldOption,
	FormReportsFieldType,
	FormReportsRowAction,
	FormReportsTableHandlers,
	FormReportsTableProps,
	FormReportsValue,
	FormReportsValues,
} from './FormReports'

// AdjustableLayout Composite
export * from './AdjustableLayout'

// PageContainer Composite
export * from './PageContainer'
export type { PageContainerProps } from './PageContainer'

// LoadingShimmer Composite
export { LoadingShimmer } from './LoadingShimmer'
export type { LoadingShimmerProps } from './LoadingShimmer'

// StateNode Composite
export { StateNode } from './StateNode'
export type { StateNodeData } from './StateNode'

// TransitionNode Composite
export { TransitionNode } from './TransitionNode'
export type { TransitionNodeData } from './TransitionNode'

// WorkflowToolbar Composite
export { WorkflowToolbar, WorkflowToolbarActions } from './WorkflowToolbar'
export type { WorkflowToolbarProps, WorkflowToolbarActionsProps, WorkflowVersion, ToolbarAction } from './WorkflowToolbar'

// WorkflowRunObservabilityPanel Composite
export { WorkflowRunObservabilityPanel } from './WorkflowRunObservabilityPanel'
export type {
	WorkflowEventRecord,
	WorkflowRunAction,
	WorkflowRunObservabilityPanelProps,
	WorkflowRunStatus,
	WorkflowRunSummary,
	WorkflowSpanRecord,
	WorkflowStreamRecord,
} from './WorkflowRunObservabilityPanel'

// InboxList Composite
export { InboxList } from './InboxList'
export type { InboxListItem, InboxListProps } from './InboxList'
