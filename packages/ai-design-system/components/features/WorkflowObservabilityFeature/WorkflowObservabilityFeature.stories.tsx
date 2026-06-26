import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { WorkflowObservabilityFeature } from "./WorkflowObservabilityFeature"
import {
  selectedWorkflowRunMock,
  workflowEventRecordsMock,
  workflowInboxItemsMock,
  workflowSpanRecordsMock,
  workflowStreamRecordsMock,
} from "./WorkflowObservabilityFeature.mocks"
import { useWorkflowObservabilityFeatureMock } from "./useWorkflowObservabilityFeature.mock"

const meta = {
  title: "Features/WorkflowObservabilityFeature",
  component: WorkflowObservabilityFeature,
  tags: ["autodocs"],
  render: (args) => (
    <WorkflowObservabilityFeature {...args} className="h-dvh w-full" />
  ),
  globals: {
    theme: "dark-neutral",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkflowObservabilityFeature>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs: Story["args"] = {
  selectedRun: selectedWorkflowRunMock,
  spans: workflowSpanRecordsMock,
  events: workflowEventRecordsMock,
  streams: workflowStreamRecordsMock,
  selectedSpanId: null,
  searchQuery: "",
  runActions: [
    { id: "replay-run", label: "Replay Run", resourceTypes: ["run"], tone: "neutral", surface: "details" },
    { id: "reenqueue-run", label: "Re-enqueue", resourceTypes: ["run"], tone: "neutral", surface: "menu" },
    { id: "cancel-active-sleeps", label: "Cancel Active Sleeps", resourceTypes: ["run"], tone: "amber", surface: "menu" },
    { id: "wake-up-sleep", label: "Wake Up Sleep", resourceTypes: ["sleep"], tone: "amber", surface: "details" },
    { id: "cancel-run", label: "Cancel", resourceTypes: ["run"], tone: "danger", surface: "details" },
  ],
  inbox: {
    items: workflowInboxItemsMock,
    selectedItemId: selectedWorkflowRunMock.runId,
    searchQuery: "",
  },
  className: "h-full",
}

const hookFocusedRunActions = [
  { id: 'wake-up-hook', label: 'Resume Hook', resourceTypes: ['hook'], tone: 'neutral' as const, surface: 'details' as const },
  { id: 'cancel-hook', label: 'Cancel Hook', resourceTypes: ['hook'], tone: 'danger' as const, surface: 'menu' as const },
]

const sleepFocusedRunActions = [
  { id: 'wake-up-sleep', label: 'Wake Up Sleep', resourceTypes: ['sleep'], tone: 'amber' as const, surface: 'details' as const },
  { id: 'cancel-active-sleeps', label: 'Cancel Active Sleeps', resourceTypes: ['sleep'], tone: 'danger' as const, surface: 'menu' as const },
]

export const Default: Story = {
  args: baseArgs,
}

export const NoSelection: Story = {
  args: {
    ...baseArgs,
    selectedRun: null,
    selectedSpanId: null,
  },
}

export const SelectedTraceRunDetails: Story = {
  args: {
    ...baseArgs,
    selectedSpanId: 'span_generateBirthdayCard',
  },
}

export const HookSuspensionState: Story = {
  args: {
    ...baseArgs,
    selectedSpanId: 'hook_01KP45XGJK16SW3BS6GGC5A04B',
    runActions: hookFocusedRunActions,
  },
}

export const SleepSuspensionState: Story = {
  args: {
    ...baseArgs,
    selectedSpanId: 'sleep_wait_01KP45XGJK16SW3BS6GGC5A04H',
    runActions: sleepFocusedRunActions,
  },
}

export const LiveUpdateSnapshot: Story = {
  args: {
    ...baseArgs,
    events: [
      ...workflowEventRecordsMock,
      {
        id: 'evt_4',
        title: 'run_resumed',
        timestamp: '4/13/2026, 12:46:12 PM',
        description: 'Workflow resumed after manual approval.',
      },
    ],
    streams: [
      ...workflowStreamRecordsMock,
      {
        id: 'stream_3',
        channel: 'event',
        payload: JSON.stringify({ event_type: 'run_resumed', actor: 'manager' }),
        timestamp: '12:46:12 PM',
      },
    ],
  },
}

export const WithStateManagement: Story = {
  args: baseArgs,
  render: () => {
    const state = useWorkflowObservabilityFeatureMock()

    return (
      <WorkflowObservabilityFeature
        selectedRun={state.selectedRun}
        spans={state.spans}
        events={state.events}
        streams={state.streams}
        selectedSpanId={state.selectedSpanId}
        searchQuery={state.searchQuery}
        runActions={state.runActions}
        onSearchQueryChange={state.actionHandlers?.onSearchQueryChange}
        onSelectSpan={state.actionHandlers?.onSelectSpan}
        inbox={state.inbox ? {
          ...state.inbox,
          onSelectItem: state.actionHandlers?.onSelectInboxItem,
          onSearchQueryChange: state.actionHandlers?.onInboxSearchQueryChange,
        } : undefined}
        className="h-dvh w-full"
      />
    )
  },
}
