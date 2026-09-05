/**
 * Blocks
 *
 * Central export point for all block components.
 * Blocks are composite components that extend AI elements with enhanced functionality.
 */

// Response Composite
export { Response } from './response'

// ToolCallDisplay Block
export { ToolCallDisplay } from './ToolCallDisplay'
export type { ToolCallDisplayProps, ToolCall } from './ToolCallDisplay'

// ReasoningDisplay Block
export { ReasoningDisplay } from './ReasoningDisplay'
export type { ReasoningDisplayProps } from './ReasoningDisplay'

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

// SystemMessage Block
export { SystemMessage } from './SystemMessage'
export type { SystemMessageProps, SystemMessageData } from './SystemMessage'


// FileQueue Block
export { FileQueue, FileStatusBadge } from './FileQueue'
export type { FileQueueProps, FileChangeData, FileStatusBadgeProps, FileStatus } from './FileQueue'

// FilePreviewDialog Composite
export { FilePreviewDialog } from './FilePreviewDialog'
export type { FilePreviewDialogProps } from './FilePreviewDialog'

// Confirmation Block
export { Confirmation } from './Confirmation'
export type { ConfirmationProps } from './Confirmation'

// ApprovalCard Composite
export { ApprovalCard } from './ApprovalCard'
export type { ApprovalCardProps, ActionRequest, ReviewConfig } from './ApprovalCard'

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

// DefaultSwitcher Composite
export { DefaultSwitcher } from './DefaultSwitcher'
export type { DefaultSwitcherProps, DefaultSwitcherItem } from './DefaultSwitcher'

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

// TriggerNode Composite
export { TriggerNode } from './TriggerNode'
export type { TriggerNodeData } from './TriggerNode'

// SpatialContainerNode Composite
export { SpatialContainerNode } from './SpatialContainerNode'
export type { SpatialContainerNodeData, SpatialContainerColorTheme, SpatialContainerVariant } from './SpatialContainerNode'

// DevicePreviewNode Composite
export { DevicePreviewNode, DEVICE_PRESETS, DEFAULT_PRESET_ID, getPreset } from './DevicePreviewNode'
export type { DevicePreset, DevicePreviewNodeData, DevicePreviewNodeType, DeviceScreenshotRequest } from './DevicePreviewNode'

// DevicePreviewToolbar Composite
export { DevicePreviewToolbar } from './DevicePreviewToolbar'
export type { DevicePreviewToolbarProps, DevicePreviewRoute } from './DevicePreviewToolbar'

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

// ModeSwitcher Composite
export { ModeSwitcher } from './ModeSwitcher'
export type { Mode, ModeSwitcherProps } from './ModeSwitcher'

// EmptyState Composite
export { EmptyState } from './EmptyState'
export type { EmptyStateProps } from './EmptyState'

// ProjectSwitcher Composite
export { ProjectSwitcher } from './ProjectSwitcher'
export type { ProjectSwitcherProps, Project } from './ProjectSwitcher'

// DashboardChart Composite
export { DashboardChart } from './DashboardChart'
export type { DashboardChartProps } from './DashboardChart'

// DashboardHeader Composite
export { DashboardHeader } from './DashboardHeader'
export type { DashboardHeaderProps } from './DashboardHeader'

// LayoutProvider Composite
export { LayoutProvider } from './LayoutProvider'
export type { LayoutProviderProps } from './LayoutProvider'

// PromptInput Composite
export {
  PromptInput,
  PromptInputProvider,
  usePromptInputController,
  usePromptInputAttachments,
  useOptionalPromptInputController,
} from './PromptInput'
export type {
  PromptInputBlockProps,
  PromptInputControllerProps,
  AttachmentsContext,
  TextInputContext,
  PromptInputProviderProps,
} from './PromptInput'

// ChatToggleButton Composite
export { ChatToggleButton } from './ChatToggleButton'
export type { ChatToggleButtonProps } from './ChatToggleButton'

// ButtonSwitcher Composite
export { ButtonSwitcher } from './ButtonSwitcher'
export type { ButtonSwitcherProps, ButtonSwitcherItem } from './ButtonSwitcher'

// SessionHeader Composite
export { SessionHeader } from './SessionHeader'
export type { SessionHeaderProps, ChatSessionInfo } from './SessionHeader'

// AppBreadcrumb Composite
export { AppBreadcrumb } from './AppBreadcrumb'
export type { AppBreadcrumbProps, BreadcrumbItemData } from './AppBreadcrumb'

// IconButton Composite
export { IconButton } from './IconButton'
export type { IconButtonProps } from './IconButton'

// AuthCard Composite
export { AuthCard } from './AuthCard'
export type { AuthCardProps, AuthMode, SocialProvider } from './AuthCard'

// MediaPreview Composite
export { MediaPreview, isVideoFile, isAudioFile, isImageFile, isPdfFile, isMediaFile } from './MediaPreview'
export type { MediaPreviewProps, MediaFileLike } from './MediaPreview'
