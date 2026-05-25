import * as React from "react"

import { SectionLayout } from "@/components/blocks/SectionLayout/SectionLayout"
import type { SectionLayoutSection } from "@/components/blocks/SectionLayout/interfaces"
import {
  type WorkflowRunAction,
  type WorkflowRunSummary,
  type WorkflowSpanRecord,
  type WorkflowEventRecord,
  type WorkflowStreamRecord,
  WorkflowRunObservabilityDetailsPanel,
  WorkflowRunObservabilityTracePanel,
} from "@/components/composites/WorkflowRunObservabilityPanel"

interface BuildObservabilitySectionsArgs {
  selectedRun: WorkflowRunSummary
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  selectedSpanId?: string | null
  onSearchQueryChange?: (value: string) => void
  onSelectSpan?: (spanId: string | null) => void
  runActions?: WorkflowRunAction[]
}

function buildObservabilitySections({
  selectedRun,
  spans,
  events,
  streams,
  searchQuery,
  selectedSpanId,
  onSearchQueryChange,
  onSelectSpan,
  runActions,
}: BuildObservabilitySectionsArgs): SectionLayoutSection[] {
  const traceSection: SectionLayoutSection = {
    id: "trace",
    content: (
      <WorkflowRunObservabilityTracePanel
        events={events}
        onSearchQueryChange={onSearchQueryChange}
        onSelectSpan={onSelectSpan}
        run={selectedRun}
        searchQuery={searchQuery}
        selectedSpanId={selectedSpanId}
        spans={spans}
        streams={streams}
      />
    ),
  }

  if (!selectedSpanId) {
    return [
      {
        ...traceSection,
        defaultSize: 100,
        minSize: 100,
      },
    ]
  }

  return [
    {
      ...traceSection,
      defaultSize: 70,
      minSize: 55,
    },
    {
      id: "details",
      content: (
        <WorkflowRunObservabilityDetailsPanel
          actions={runActions}
          events={events}
          onClose={() => onSelectSpan?.(null)}
          run={selectedRun}
          selectedSpanId={selectedSpanId}
          spans={spans}
        />
      ),
      defaultSize: 30,
      minSize: 25,
    },
  ]
}

export interface WorkflowObservabilityFeatureProps {
  selectedRun: WorkflowRunSummary | null
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  selectedSpanId?: string | null
  onSearchQueryChange?: (value: string) => void
  onSelectSpan?: (spanId: string | null) => void
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
    const sections = React.useMemo(
      () =>
        selectedRun
          ? buildObservabilitySections({
              selectedRun,
              spans,
              events,
              streams,
              searchQuery,
              selectedSpanId,
              onSearchQueryChange,
              onSelectSpan,
              runActions,
            })
          : [],
      [
        selectedRun,
        spans,
        events,
        streams,
        searchQuery,
        selectedSpanId,
        onSearchQueryChange,
        onSelectSpan,
        runActions,
      ]
    )

    return (
      <div className={`flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden ${className ?? ""}`}>
        {selectedRun ? (
          <SectionLayout
            className="h-full min-h-0 max-h-[calc(100dvh-2rem)] overflow-hidden"
            dragHandleColor="border"
            orientation="horizontal"
            sections={sections}
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
