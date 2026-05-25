import type {
  WorkflowEventRecord,
  WorkflowRunAction,
  WorkflowRunSummary,
  WorkflowSpanRecord,
  WorkflowStreamRecord,
} from "@/components/composites/WorkflowRunObservabilityPanel"

export interface WorkflowObservabilityFeatureActionHandlers {
  onSearchQueryChange?: (value: string) => void
  onSelectSpan?: (spanId: string) => void
}

export interface UseWorkflowObservabilityFeatureReturn {
  selectedRun: WorkflowRunSummary | null
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  selectedSpanId?: string | null
  runActions?: WorkflowRunAction[]
  actionHandlers?: WorkflowObservabilityFeatureActionHandlers
}

export function useWorkflowObservabilityFeature(): UseWorkflowObservabilityFeatureReturn
