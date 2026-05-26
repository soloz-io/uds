import * as React from "react"

import { InboxPanel } from "@/components/blocks/InboxPanel"
import { SectionLayout } from "@/components/blocks/SectionLayout/SectionLayout"
import type { SectionLayoutSection } from "@/components/blocks/SectionLayout/interfaces"
import type { InboxListItem } from "@/components/composites/InboxList"
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

export interface WorkflowObservabilityInboxConfig {
  items: InboxListItem[]
  selectedItemId?: string | null
  onSelectItem?: (itemId: string) => void
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  isLoading?: boolean
  emptyMessage?: string
  defaultSize?: number
  minSize?: number
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
      defaultSize: 66.67,
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
      defaultSize: 33.33,
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
  inbox?: WorkflowObservabilityInboxConfig
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
    inbox,
    className,
  }) => {
    const observabilitySections = React.useMemo(
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

    const observabilityContent = selectedRun ? (
      <SectionLayout
        className="h-full min-h-0 overflow-hidden"
        dragHandleColor="border"
        orientation="horizontal"
        resizable={false}
        sections={observabilitySections}
      />
    ) : (
      <div className="rounded-lg border p-6 text-muted-foreground text-sm">
        Select a run to inspect trace, events, and streams.
      </div>
    )

    const rootSections = React.useMemo<SectionLayoutSection[] | null>(() => {
      if (!inbox) {
        return null
      }

      return [
        {
          id: "inbox",
          content: (
            <InboxPanel
              items={inbox.items}
              selectedItemId={inbox.selectedItemId}
              onSelectItem={inbox.onSelectItem}
              searchQuery={inbox.searchQuery}
              onSearchQueryChange={inbox.onSearchQueryChange}
              isLoading={inbox.isLoading}
              emptyMessage={inbox.emptyMessage}
              className="h-full"
            />
          ),
          fixedSize: "16rem",
        },
        {
          id: "observability",
          content: observabilityContent,
          defaultSize: 70,
          minSize: 40,
        },
      ]
    }, [inbox, observabilityContent])

    return (
      <div className={`flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden ${className ?? ""}`}>
        {rootSections ? (
          <SectionLayout
            className="h-full min-h-0 overflow-hidden"
            dragHandleColor="primary"
            orientation="horizontal"
            resizable={false}
            sections={rootSections}
          />
        ) : (
          observabilityContent
        )}
      </div>
    )
  }
)

WorkflowObservabilityFeature.displayName = "WorkflowObservabilityFeature"
