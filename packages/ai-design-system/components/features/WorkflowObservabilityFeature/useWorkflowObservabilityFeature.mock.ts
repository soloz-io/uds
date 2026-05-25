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
  const [selectedSpanId, setSelectedSpanId] = React.useState<string | null>(null)
  const [selectedRun, setSelectedRun] = React.useState(selectedWorkflowRunMock)
  const [spans, setSpans] = React.useState(workflowSpanRecordsMock)
  const [events, setEvents] = React.useState(workflowEventRecordsMock)
  const [streams, setStreams] = React.useState(workflowStreamRecordsMock)

  const selectedSpan = React.useMemo(
    () => spans.find((span) => span.id === selectedSpanId) ?? null,
    [spans, selectedSpanId]
  )

  const appendEventAndStream = React.useCallback(
    (eventTitle: string, description: string, streamPayload: Record<string, unknown>) => {
      const now = new Date()
      const eventTime = now.toLocaleString()
      const streamTime = now.toLocaleTimeString()

      setEvents((prev) => [
        ...prev,
        {
          id: `evt_${prev.length + 1}`,
          title: eventTitle,
          timestamp: eventTime,
          description,
        },
      ])

      setStreams((prev) => [
        ...prev,
        {
          id: `stream_${prev.length + 1}`,
          channel: "event",
          payload: JSON.stringify(streamPayload),
          timestamp: streamTime,
        },
      ])
    },
    []
  )

  const wakeUpSleep = React.useCallback(() => {
    if (!selectedSpan || selectedSpan.resource !== "sleep") return

    setSpans((prev) =>
      prev.map((span) =>
        span.id === selectedSpan.id
          ? {
              ...span,
              state: "completed",
              subtitle: "Sleep resumed by operator",
              outputPayload: {
                wakeResult: "manual_resume",
              },
            }
          : span
      )
    )

    setSelectedRun((prev) => ({
      ...prev,
      suspensionReason: "-",
      status: "running",
    }))

    appendEventAndStream("run_woken_up", "Sleep trace resumed from action button.", {
      event_type: "run_woken_up",
      span_id: selectedSpan.id,
      status: "running",
    })
  }, [appendEventAndStream, selectedSpan])

  const resolveHook = React.useCallback(() => {
    if (!selectedSpan || selectedSpan.resource !== "hook") return

    setSpans((prev) =>
      prev.map((span) =>
        span.id === selectedSpan.id
          ? {
              ...span,
              state: "completed",
              subtitle: "Hook resolved with payload",
              outputPayload: {
                resolution: "approved",
              },
            }
          : span
      )
    )

    setSelectedRun((prev) => ({
      ...prev,
      suspensionReason: "-",
      status: "running",
    }))

    appendEventAndStream("hook_resolved", "Hook token resolved through action panel.", {
      event_type: "hook_resolved",
      span_id: selectedSpan.id,
      result: "approved",
    })
  }, [appendEventAndStream, selectedSpan])

  const cancelRun = React.useCallback(() => {
    if (!selectedSpan || selectedSpan.resource !== "run") return

    const now = new Date().toLocaleString()

    setSelectedRun((prev) => ({
      ...prev,
      status: "cancelled",
      completedAt: now,
      suspensionReason: "error",
    }))

    appendEventAndStream("run_cancelled", "Run cancelled from observability action panel.", {
      event_type: "run_cancelled",
      run_id: selectedRun.runId,
      status: "cancelled",
    })
  }, [appendEventAndStream, selectedRun.runId, selectedSpan])

  return {
    selectedRun,
    spans,
    events,
    streams,
    searchQuery,
    selectedSpanId,
    runActions: [
      { id: "wake-up", label: "Wake Up Sleep", onClick: wakeUpSleep, resourceTypes: ["sleep"], tone: "amber" },
      { id: "resolve-hook", label: "Resolve Hook", onClick: resolveHook, resourceTypes: ["hook"], tone: "neutral" },
      { id: "cancel-run", label: "Cancel Run", onClick: cancelRun, resourceTypes: ["run"], tone: "danger" },
    ],
    actionHandlers: {
      onSearchQueryChange: setSearchQuery,
      onSelectSpan: setSelectedSpanId,
    },
  }
}
