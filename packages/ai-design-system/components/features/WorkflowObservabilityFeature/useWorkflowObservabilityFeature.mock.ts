import * as React from "react"

import type { UseWorkflowObservabilityFeatureReturn } from "./useWorkflowObservabilityFeature.d"
import {
  selectedWorkflowRunMock,
  workflowEventRecordsMock,
  workflowInboxItemsMock,
  workflowSpanRecordsMock,
  workflowStreamRecordsMock,
} from "./WorkflowObservabilityFeature.mocks"

const runByInboxId: Record<string, typeof selectedWorkflowRunMock> = {
  [selectedWorkflowRunMock.runId]: selectedWorkflowRunMock,
  wrun_01KP45XGBHRMT7HQJXXHKBEQS5: {
    ...selectedWorkflowRunMock,
    runId: "wrun_01KP45XGBHRMT7HQJXXHKBEQS5",
    status: "completed",
    createdAt: "7m ago",
    completedAt: "today 12:45 PM",
    duration: "43s",
    suspensionReason: "-",
  },
}

export function useWorkflowObservabilityFeatureMock(): UseWorkflowObservabilityFeatureReturn {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSpanId, setSelectedSpanId] = React.useState<string | null>(null)
  const [inboxSearchQuery, setInboxSearchQuery] = React.useState("")
  const [selectedInboxItemId, setSelectedInboxItemId] = React.useState<string | null>(selectedWorkflowRunMock.runId)
  const [selectedRun, setSelectedRun] = React.useState(selectedWorkflowRunMock)
  const [spans, setSpans] = React.useState(workflowSpanRecordsMock)
  const [events, setEvents] = React.useState(workflowEventRecordsMock)
  const [streams, setStreams] = React.useState(workflowStreamRecordsMock)

  const inboxItems = React.useMemo(() => {
    const normalizedQuery = inboxSearchQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return workflowInboxItemsMock
    }

    return workflowInboxItemsMock.filter((item) => {
      const searchText = [item.title, item.subtitle, item.preview].filter(Boolean).join(" ").toLowerCase()
      return searchText.includes(normalizedQuery)
    })
  }, [inboxSearchQuery])

  const isRunActive = selectedRun.status === "pending" || selectedRun.status === "running"
  const hasPendingSleeps = React.useMemo(
    () => spans.some((span) => span.resource === "sleep" && span.state === "live"),
    [spans]
  )
  const isSelectedSleepLive = React.useMemo(() => {
    if (!selectedSpanId) return false
    const selectedSpan = spans.find((span) => span.id === selectedSpanId)
    return selectedSpan?.resource === "sleep" && selectedSpan.state === "live"
  }, [selectedSpanId, spans])

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

  const replayRun = React.useCallback(() => {
    const now = new Date()
    const newRunId = `wrun_${now.getTime()}`

    setSelectedRun((prev) => ({
      ...prev,
      runId: newRunId,
      status: "running",
      createdAt: now.toLocaleTimeString(),
      startedAt: now.toLocaleTimeString(),
      completedAt: "-",
      suspensionReason: "webhook",
    }))

    setSelectedInboxItemId(newRunId)
    setSelectedSpanId("span_generateBirthdayCard")

    appendEventAndStream("run_replayed", "A new run was started from replay action.", {
      event_type: "run_replayed",
      run_id: newRunId,
      status: "running",
    })
  }, [appendEventAndStream])

  const reenqueueRun = React.useCallback(() => {
    setSelectedRun((prev) => ({
      ...prev,
      status: "running",
    }))

    appendEventAndStream("run_reenqueued", "Workflow orchestration was re-enqueued.", {
      event_type: "run_reenqueued",
      run_id: selectedRun.runId,
      status: "running",
    })
  }, [appendEventAndStream, selectedRun.runId])

  const cancelActiveSleeps = React.useCallback(() => {
    if (!hasPendingSleeps) return

    setSpans((prev) =>
      prev.map((span) =>
        span.resource === "sleep" && span.state === "live"
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

    appendEventAndStream("run_woken_up", "Active sleeps were cancelled and run resumed.", {
      event_type: "run_woken_up",
      run_id: selectedRun.runId,
      status: "running",
    })
  }, [appendEventAndStream, hasPendingSleeps, selectedRun.runId])

  const wakeUpSleep = React.useCallback(() => {
    if (!selectedSpanId) return

    let didWake = false
    setSpans((prev) =>
      prev.map((span) => {
        if (span.id === selectedSpanId && span.resource === "sleep" && span.state === "live") {
          didWake = true
          return {
            ...span,
            state: "completed",
            subtitle: "Sleep resumed by operator",
            outputPayload: {
              wakeResult: "manual_resume",
            },
          }
        }
        return span
      })
    )

    if (!didWake) return

    setSelectedRun((prev) => ({
      ...prev,
      suspensionReason: "-",
      status: "running",
    }))

    appendEventAndStream("sleep_woken_up", "Selected sleep span resumed by operator.", {
      event_type: "sleep_woken_up",
      run_id: selectedRun.runId,
      span_id: selectedSpanId,
      status: "running",
    })
  }, [appendEventAndStream, selectedRun.runId, selectedSpanId])

  const cancelRun = React.useCallback(() => {
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
  }, [appendEventAndStream, selectedRun.runId])

  const selectInboxItem = React.useCallback((itemId: string) => {
    setSelectedInboxItemId(itemId)
    setSelectedSpanId(null)

    const nextRun = runByInboxId[itemId]
    if (nextRun) {
      setSelectedRun(nextRun)
    }
  }, [])

  return {
    selectedRun,
    spans,
    events,
    streams,
    searchQuery,
    selectedSpanId,
    inbox: {
      items: inboxItems,
      selectedItemId: selectedInboxItemId,
      searchQuery: inboxSearchQuery,
      isLoading: false,
      emptyMessage: "No runs found.",
    },
    runActions: [
      {
        id: "replay-run",
        label: "Replay Run",
        onClick: replayRun,
        disabled: isRunActive,
        resourceTypes: ["run"],
        tone: "neutral",
        surface: "details",
      },
      {
        id: "reenqueue-run",
        label: "Re-enqueue",
        onClick: reenqueueRun,
        resourceTypes: ["run"],
        tone: "neutral",
        surface: "menu",
      },
      {
        id: "cancel-active-sleeps",
        label: "Cancel Active Sleeps",
        onClick: cancelActiveSleeps,
        disabled: !hasPendingSleeps,
        resourceTypes: ["run"],
        tone: "amber",
        surface: "menu",
      },
      {
        id: "wake-up-sleep",
        label: "Wake Up Sleep",
        onClick: wakeUpSleep,
        disabled: !isSelectedSleepLive,
        resourceTypes: ["sleep"],
        tone: "amber",
        surface: "details",
      },
      {
        id: "cancel-run",
        label: "Cancel",
        onClick: cancelRun,
        disabled: !isRunActive,
        resourceTypes: ["run"],
        tone: "danger",
        surface: "details",
      },
    ],
    actionHandlers: {
      onSearchQueryChange: setSearchQuery,
      onSelectSpan: setSelectedSpanId,
      onInboxSearchQueryChange: setInboxSearchQuery,
      onSelectInboxItem: selectInboxItem,
    },
  }
}
