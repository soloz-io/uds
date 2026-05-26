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
    <div className="h-dvh min-h-0 p-2">
      <WorkflowObservabilityFeature {...args} className="h-full" />
    </div>
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

export const Default: Story = {
  args: baseArgs,
}

export const WithStateManagement: Story = {
  args: baseArgs,
  render: () => {
    const state = useWorkflowObservabilityFeatureMock()

    return (
      <div className="h-dvh min-h-0 p-2">
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
          className="h-full"
        />
      </div>
    )
  },
}
