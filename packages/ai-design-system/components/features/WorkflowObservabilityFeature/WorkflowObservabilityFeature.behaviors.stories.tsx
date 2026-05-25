import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "@storybook/test"

import { WorkflowObservabilityFeature } from "./WorkflowObservabilityFeature"
import {
  selectedWorkflowRunMock,
  workflowEventRecordsMock,
  workflowSpanRecordsMock,
  workflowStreamRecordsMock,
} from "./WorkflowObservabilityFeature.mocks"

const onSearchQueryChange = fn()
const onSelectSpan = fn()
const onWakeUp = fn()

const meta = {
  title: "Features/WorkflowObservabilityFeature/Behaviors",
  component: WorkflowObservabilityFeature,
  tags: ["test"],
  globals: {
    theme: "dark-neutral",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkflowObservabilityFeature>

export default meta
type Story = StoryObj<typeof meta>

const args: Story["args"] = {
  selectedRun: selectedWorkflowRunMock,
  spans: workflowSpanRecordsMock,
  events: workflowEventRecordsMock,
  streams: workflowStreamRecordsMock,
  selectedSpanId: workflowSpanRecordsMock[0]?.id,
  searchQuery: "",
  onSearchQueryChange,
  onSelectSpan,
  runActions: [{ id: "wake-up", label: "Wake Up Sleep", onClick: onWakeUp }],
}

export const SearchSpans: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByPlaceholderText(/Search spans/i), "hook")
    await expect(onSearchQueryChange).toHaveBeenCalled()
  },
}

export const SelectSpan: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const targetSpan = workflowSpanRecordsMock[1]
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(targetSpan.label, "i") }))

    await expect(onSelectSpan).toHaveBeenCalledWith(targetSpan.id)
  },
}

export const SwitchToEventsTab: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("tab", { name: /Events/i }))
    await expect(await canvas.findByText(/run_created/i)).toBeInTheDocument()
  },
}

export const TriggerRunAction: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /Wake Up Sleep/i }))
    await expect(onWakeUp).toHaveBeenCalled()
  },
}
