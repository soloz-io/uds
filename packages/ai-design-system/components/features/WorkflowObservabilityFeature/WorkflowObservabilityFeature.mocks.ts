import type {
  WorkflowEventRecord,
  WorkflowRunSummary,
  WorkflowSpanRecord,
  WorkflowStreamRecord,
} from "@/components/composites/WorkflowRunObservabilityPanel"

export const selectedWorkflowRunMock: WorkflowRunSummary = {
  runId: "wrun_01KP45XGBHRMT7HQJXXHKBEQS4",
  workflowName: "generateBirthdayCard",
  status: "running",
  createdAt: "1m ago",
  startedAt: "today 12:44 PM",
  completedAt: "-",
  duration: "1m 43s",
  expiresAt: "-",
  storage: "5 MB",
  moduleSpecifier: "./app/api/generate/generate-birthday-card.ts",
  resumeAt: "4/23/2026, 12:00:00 AM",
  suspensionReason: "webhook",
  argumentsPayload: {
    recipientName: "Maya",
    tone: "friendly",
    includeEmoji: true,
  },
  inputPayload: {
    prompt: "Generate a birthday greeting card with confetti accents",
    locale: "en-US",
  },
  outputPayload: {
    cardId: "card_90210",
    status: "draft",
    revision: 3,
  },
}

export const workflowSpanRecordsMock: WorkflowSpanRecord[] = [
  {
    id: "span_generateBirthdayCard",
    label: "generateBirthdayCard",
    duration: "1m 43s",
    state: "live",
    lane: "Queued 200ms",
    startPercent: 2,
    lengthPercent: 82,
    subtitle: "Queued 200ms",
    resource: "run",
    suspensionReason: "webhook",
    argumentsPayload: {
      workflow: "generateBirthdayCard",
      priority: "high",
    },
    inputPayload: {
      source: "scheduler",
      tenant: "acme",
    },
    outputPayload: {
      status: "running",
      checkpointsCompleted: 2,
    },
  },
  {
    id: "hook_01KP45XGJK16SW3BS6GGC5A04B",
    label: "hook_01KP45XGJK16SW3BS6GGC5A04B",
    duration: "1m 31s",
    state: "live",
    lane: "Waiting 1m 6s",
    startPercent: 12,
    lengthPercent: 70,
    subtitle: "Waiting 1m 6s • Received 24.41s",
    resource: "hook",
    resumeAt: "4/23/2026, 12:00:00 AM",
    suspensionReason: "webhook",
    argumentsPayload: {
      token: "hook_01KP45XGJK16...",
      waitMode: "manual",
    },
    inputPayload: {
      prompt: "Approve birthday card draft",
      requestedBy: "ops",
    },
    outputPayload: {
      resolution: "pending",
    },
  },
  {
    id: "sleep_wait_01KP45XGJK16SW3BS6GGC5A04H",
    label: "sleep",
    duration: "21.85s",
    state: "live",
    lane: "Sleep",
    startPercent: 74,
    lengthPercent: 18,
    subtitle: "Sleep waiting for resume",
    resource: "sleep",
    resumeAt: "4/13/2026, 12:46:10 PM",
    suspensionReason: "sleep",
    argumentsPayload: {
      delayMs: 20000,
      reason: "rate-limit-backoff",
    },
    inputPayload: {
      beforeState: "hook_waiting",
    },
    outputPayload: {
      wakeResult: "pending",
    },
  },
]

export const workflowEventRecordsMock: WorkflowEventRecord[] = [
  {
    id: "evt_1",
    title: "run_created",
    timestamp: "4/13/2026, 12:44:46 PM",
    description: "Workflow run was created.",
  },
  {
    id: "evt_2",
    title: "hook_waiting",
    timestamp: "4/13/2026, 12:45:01 PM",
    description: "Workflow is suspended waiting for resume token.",
  },
  {
    id: "evt_3",
    title: "run_woken_up",
    timestamp: "4/13/2026, 12:46:10 PM",
    description: "Run resumed from sleep.",
  },
]

export const workflowStreamRecordsMock: WorkflowStreamRecord[] = [
  {
    id: "stream_1",
    channel: "status",
    payload: JSON.stringify({ run_id: "wrun_01KP45XGBHRMT7HQJXXHKBEQS4", status: "running" }),
    timestamp: "12:44:46 PM",
  },
  {
    id: "stream_2",
    channel: "event",
    payload: JSON.stringify({ event_type: "hook_waiting", token: "hook_01KP..." }),
    timestamp: "12:45:01 PM",
  },
]
