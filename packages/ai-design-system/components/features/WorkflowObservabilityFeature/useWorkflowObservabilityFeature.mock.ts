import * as React from "react"

import type { UseWorkflowObservabilityFeatureReturn } from "./useWorkflowObservabilityFeature.d"
import {
  selectedWorkflowRunMock,
  workflowEventRecordsMock,
  workflowSpanRecordsMock,
  workflowStreamRecordsMock,
} from "./WorkflowObservabilityFeature.mocks"

export function useWorkflowObservabilityFeatureMock(): UseWorkflowObservabilityFeatureReturn {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSpanId, setSelectedSpanId] = React.useState<string | null>(
    workflowSpanRecordsMock[0]?.id ?? null
  )

  return {
    selectedRun: selectedWorkflowRunMock,
    spans: workflowSpanRecordsMock,
    events: workflowEventRecordsMock,
    streams: workflowStreamRecordsMock,
    searchQuery,
    selectedSpanId,
    runActions: [{ id: "wake-up", label: "Wake Up Sleep" }],
    actionHandlers: {
      onSearchQueryChange: setSearchQuery,
      onSelectSpan: setSelectedSpanId,
    },
  }
}
