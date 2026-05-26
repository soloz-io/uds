import type {
  WorkflowEventRecord,
  WorkflowRunAction,
  WorkflowRunSummary,
  WorkflowSpanRecord,
  WorkflowStreamRecord,
} from "@/components/composites/WorkflowRunObservabilityPanel"
import type { InboxListItem } from "@/components/composites/InboxList"

export interface WorkflowObservabilityFeatureActionHandlers {
  onSearchQueryChange?: (value: string) => void
  onSelectSpan?: (spanId: string | null) => void
  onInboxSearchQueryChange?: (value: string) => void
  onSelectInboxItem?: (itemId: string) => void
}

export interface WorkflowObservabilityFeatureInboxState {
  items: InboxListItem[]
  selectedItemId?: string | null
  searchQuery?: string
  isLoading?: boolean
  emptyMessage?: string
}

export interface UseWorkflowObservabilityFeatureReturn {
  selectedRun: WorkflowRunSummary | null
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  selectedSpanId?: string | null
  runActions?: WorkflowRunAction[]
  inbox?: WorkflowObservabilityFeatureInboxState
  actionHandlers?: WorkflowObservabilityFeatureActionHandlers
}

export function useWorkflowObservabilityFeature(): UseWorkflowObservabilityFeatureReturn
