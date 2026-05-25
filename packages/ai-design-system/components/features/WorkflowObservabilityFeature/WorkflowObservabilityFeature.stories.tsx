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

const baseArgs: Story["args"] = {
  selectedRun: selectedWorkflowRunMock,
  spans: workflowSpanRecordsMock,
  events: workflowEventRecordsMock,
  streams: workflowStreamRecordsMock,
  selectedSpanId: null,
  searchQuery: "",
  runActions: [
    { id: "wake-up", label: "Wake Up Sleep", resourceTypes: ["sleep"], tone: "amber" },
    { id: "resolve-hook", label: "Resolve Hook", resourceTypes: ["hook"], tone: "neutral" },
    { id: "cancel-run", label: "Cancel Run", resourceTypes: ["run"], tone: "danger" },
  ],
}

export const Default: Story = {
  args: baseArgs,
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
      />
    )
  },
}
