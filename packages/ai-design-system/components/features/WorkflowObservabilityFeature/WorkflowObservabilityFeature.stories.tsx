import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { WorkflowObservabilityFeature } from "./WorkflowObservabilityFeature"
import {
  selectedWorkflowRunMock,
  workflowEventRecordsMock,
  workflowSpanRecordsMock,
  workflowStreamRecordsMock,
} from "./WorkflowObservabilityFeature.mocks"
import { useWorkflowObservabilityFeatureMock } from "./useWorkflowObservabilityFeature.mock"

const meta = {
  title: "Features/WorkflowObservabilityFeature",
  component: WorkflowObservabilityFeature,
  tags: ["autodocs"],
  globals: {
    theme: "dark-neutral",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkflowObservabilityFeature>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    selectedRun: selectedWorkflowRunMock,
    spans: workflowSpanRecordsMock,
    events: workflowEventRecordsMock,
    streams: workflowStreamRecordsMock,
    selectedSpanId: workflowSpanRecordsMock[0]?.id,
    searchQuery: "",
    runActions: [{ id: "wake-up", label: "Wake Up Sleep" }],
  },
}

export const WithStateManagement: Story = {
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
      />
    )
  },
}
