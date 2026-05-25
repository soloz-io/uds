import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "@storybook/test"
import * as React from "react"

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
  selectedSpanId: null,
  searchQuery: "",
  onSearchQueryChange,
  onSelectSpan,
  runActions: [
    { id: "wake-up", label: "Wake Up Sleep", onClick: onWakeUp, resourceTypes: ["sleep"], tone: "amber" },
    { id: "resolve-hook", label: "Resolve Hook", resourceTypes: ["hook"], tone: "neutral" },
    { id: "cancel-run", label: "Cancel Run", resourceTypes: ["run"], tone: "danger" },
  ],
}

function InteractiveStoryHarness() {
  const [selectedSpanId, setSelectedSpanId] = React.useState<string | null>(null)

  return (
    <WorkflowObservabilityFeature
      {...args}
      onSelectSpan={setSelectedSpanId}
      selectedSpanId={selectedSpanId}
    />
  )
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

    await expect(canvas.queryByTestId("trace-details-panel")).not.toBeInTheDocument()

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
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /sleep/i }))
    await userEvent.click(canvas.getByRole("button", { name: /Wake Up Sleep/i }))
    await expect(onWakeUp).toHaveBeenCalled()
  },
}

export const ResourceActions: Story = {
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /hook_01KP45XGJK16SW3BS6GGC5A04B/i }))
    await expect(await canvas.findByRole("button", { name: /Resolve Hook/i })).toBeInTheDocument()
    await expect(canvas.queryByRole("button", { name: /Wake Up Sleep/i })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: /generateBirthdayCard/i }))
    await expect(await canvas.findByRole("button", { name: /Cancel Run/i })).toBeInTheDocument()
    await expect(canvas.queryByRole("button", { name: /Resolve Hook/i })).not.toBeInTheDocument()
  },
}

export const RunDetailsPayloadBlocks: Story = {
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /generateBirthdayCard/i }))
    await expect(await canvas.findByText(/Arguments/i)).toBeInTheDocument()
    await expect(await canvas.findByText(/Input/i)).toBeInTheDocument()
    await expect(await canvas.findByText(/Output/i)).toBeInTheDocument()
  },
}
