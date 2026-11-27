export { AIConversation } from './AIConversation'
export type { AIConversationProps } from './AIConversation'

export { AppSidebar } from './AppSidebar'
export type { AppSidebarProps } from './AppSidebar'

export { DocumentEditorWithComments } from './DocumentEditorWithComments'
export type { DocumentEditorWithCommentsProps } from './DocumentEditorWithComments'

export { FileChangeQueue } from './FileChangeQueue'
export type { FileChangeQueueProps } from './FileChangeQueue'

// Blocks
export * from './SectionLayout'

// ExpoAppPreview lives in ai-elements (it's a generic sandboxed iframe
// container); re-exported here for backward compatibility.
export { ExpoAppPreview } from '@/components/ai-elements/ExpoAppPreview'
export type { ExpoAppPreviewProps } from '@/components/ai-elements/ExpoAppPreview'

export { WorkspaceEmptyState, SandboxWakePane } from '@/components/composites/WorkspaceEmptyState'
export type { WorkspaceEmptyStateProps, SandboxWakePaneProps, WorkspaceWakeStatus } from '@/components/composites/WorkspaceEmptyState'

export { WorkflowCanvas, getLayoutedElements } from './WorkflowCanvas'
export type { WorkflowCanvasProps, WorkflowNode, WorkflowEdge, WorkflowNodeData } from './WorkflowCanvas'

export { sectionsToCanvas } from './SectionCanvas'
export type { CanvasSection, CanvasCell, SectionCanvasInput, SectionCanvasView } from './SectionCanvas'

export { DashboardMetrics } from './DashboardMetrics'
export type { DashboardMetricsProps } from './DashboardMetrics'

export { DataTable } from './DataTable'
export type { DataTableProps } from './DataTable'

export { FormReportsSection } from './FormReportsSection'
export type { FormReportsSectionProps } from './FormReportsSection'

export { InboxPanel } from './InboxPanel'
export type { InboxPanelProps } from './InboxPanel'

// EvalSessionDetailsPanel Block
export { EvalSessionDetailsPanel, EvalTriggerButton } from './EvalSessionDetailsPanel'
export type { EvalSessionDetailsPanelProps, EvalSessionDetails } from './EvalSessionDetailsPanel'

// Generic Page Blocks
export { HeroSection } from './HeroSection'
export type { HeroSectionProps } from './HeroSection'

export { FeatureSection } from './FeatureSection'
export type { FeatureSectionProps } from './FeatureSection'

// PromptTaskQueue Block
export { PromptTaskQueue, PromptInputWithQueue } from './PromptTaskQueue'
export type { PromptTaskQueueProps, PromptInputWithQueueProps } from './PromptTaskQueue'

// StoryPlayer Block
export { StoryPlayer, ScenePlayer } from './StoryPlayer'
export type { StoryPlayerProps, ScenePlayerProps, StorySegment, SceneItem } from './StoryPlayer'

export { GraphCanvas, placeGraphNodes } from './GraphCanvas'
export type { GraphCanvasProps, GraphCanvasNode, GraphCanvasEdge, GraphCanvasGroup, GraphCanvasStatus, GraphCanvasDetails, GraphCanvasBreadcrumb, GraphPosition, GraphTone } from './GraphCanvas'

// TurnTimeline Block
export { TurnTimeline } from './TurnTimeline'
export type { TurnTimelineProps, TimelineTurn, TimelineEvent, TimelineFeedback } from './TurnTimeline'

// ComparisonReport Block
export { ComparisonReport } from './ComparisonReport'
export type { ComparisonReportProps, ComparisonCriterion, ComparisonSide } from './ComparisonReport'


// EvalImprovementPanel Block
export { EvalImprovementPanel, nextExperiment } from './EvalImprovementPanel'
export type { EvalImprovementPanelProps, EvalImprovementTarget, EvalProposedChange, EvalExperiment, EvalExperimentStep } from './EvalImprovementPanel'
