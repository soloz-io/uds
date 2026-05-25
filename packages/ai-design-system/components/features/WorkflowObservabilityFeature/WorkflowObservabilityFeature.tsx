import * as React from "react"

import {
  WorkflowRunObservabilityPanel,
  type WorkflowRunAction,
  type WorkflowRunSummary,
  type WorkflowSpanRecord,
  type WorkflowEventRecord,
  type WorkflowStreamRecord,
} from "@/components/composites/WorkflowRunObservabilityPanel"

export interface WorkflowObservabilityFeatureProps {
  selectedRun: WorkflowRunSummary | null
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  selectedSpanId?: string | null
  onSearchQueryChange?: (value: string) => void
  onSelectSpan?: (spanId: string) => void
  runActions?: WorkflowRunAction[]
  className?: string
}

export const WorkflowObservabilityFeature = React.memo<WorkflowObservabilityFeatureProps>(
  ({
    selectedRun,
    spans,
    events,
    streams,
    searchQuery,
    selectedSpanId,
    onSearchQueryChange,
    onSelectSpan,
    runActions,
    className,
  }) => {
    return (
      <div className={`flex flex-1 flex-col gap-4 ${className ?? ""}`}>
        {selectedRun ? (
          <WorkflowRunObservabilityPanel
            actions={runActions}
            events={events}
            onSearchQueryChange={onSearchQueryChange}
            onSelectSpan={onSelectSpan}
            run={selectedRun}
            searchQuery={searchQuery}
            selectedSpanId={selectedSpanId}
            spans={spans}
            streams={streams}
          />
        ) : (
          <div className="rounded-lg border p-6 text-muted-foreground text-sm">
            Select a run to inspect trace, events, and streams.
          </div>
        )}
      </div>
    )
  }
)

WorkflowObservabilityFeature.displayName = "WorkflowObservabilityFeature"
