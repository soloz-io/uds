import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "@storybook/test"
import * as React from "react"

import { WorkflowObservabilityFeature } from "./WorkflowObservabilityFeature"
import {
  selectedWorkflowRunMock,
  workflowEventRecordsMock,
  workflowInboxItemsMock,
  workflowSpanRecordsMock,
  workflowStreamRecordsMock,
} from "./WorkflowObservabilityFeature.mocks"

const onSearchQueryChange = fn()
const onSelectSpan = fn()
const onSelectInboxItem = fn()
const onReplayRun = fn()
const onReenqueue = fn()
const onCancelActiveSleeps = fn()
const onWakeUpSleep = fn()
const onCancel = fn()

const meta = {
  title: "Features/WorkflowObservabilityFeature/Behaviors",
  component: WorkflowObservabilityFeature,
  tags: ["test"],
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
    { id: "replay-run", label: "Replay Run", onClick: onReplayRun, resourceTypes: ["run"], tone: "neutral", surface: "details" },
    { id: "reenqueue-run", label: "Re-enqueue", onClick: onReenqueue, resourceTypes: ["run"], tone: "neutral", surface: "menu" },
    { id: "cancel-active-sleeps", label: "Cancel Active Sleeps", onClick: onCancelActiveSleeps, resourceTypes: ["run"], tone: "amber", surface: "menu" },
    { id: "wake-up-sleep", label: "Wake Up Sleep", onClick: onWakeUpSleep, resourceTypes: ["sleep"], tone: "amber", surface: "details" },
    { id: "cancel-run", label: "Cancel", onClick: onCancel, resourceTypes: ["run"], tone: "danger", surface: "details" },
  ],
  inbox: {
    items: workflowInboxItemsMock,
    selectedItemId: selectedWorkflowRunMock.runId,
    onSelectItem: onSelectInboxItem,
    searchQuery: "",
    onSearchQueryChange: fn(),
  },
  className: "h-full",
}

function InteractiveStoryHarness() {
  const [selectedSpanId, setSelectedSpanId] = React.useState<string | null>(null)

  return (
    <div className="h-dvh min-h-0 p-2">
      <WorkflowObservabilityFeature
        {...args}
        className="h-full"
        onSelectSpan={setSelectedSpanId}
        selectedSpanId={selectedSpanId}
      />
    </div>
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
  args,
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /generateBirthdayCard/i }))
    await userEvent.click(canvas.getByRole("button", { name: /Replay Run/i }))
    await expect(onReplayRun).toHaveBeenCalled()
  },
}

export const ResourceActions: Story = {
  args,
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /hook_01KP45XGJK16SW3BS6GGC5A04B/i }))
    await expect(await canvas.findByText(/No actions available\./i)).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: /generateBirthdayCard/i }))
    await expect(await canvas.findByRole("button", { name: /Replay Run/i })).toBeInTheDocument()
    await expect(await canvas.findByRole("button", { name: /^Cancel$/i })).toBeInTheDocument()
    await expect(canvas.queryByRole("button", { name: /Re-enqueue/i })).not.toBeInTheDocument()
    await expect(canvas.queryByRole("button", { name: /Cancel Active Sleeps/i })).not.toBeInTheDocument()
  },
}

export const RunDetailsPayloadBlocks: Story = {
  args,
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /generateBirthdayCard/i }))
    await expect(await canvas.findByText(/Arguments/i)).toBeInTheDocument()
    await expect(await canvas.findByText(/Input/i)).toBeInTheDocument()
    await expect(await canvas.findByText(/Output/i)).toBeInTheDocument()
  },
}

export const DynamicDetailsChips: Story = {
  args,
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /generateBirthdayCard/i }))
    const runDetails = await canvas.findByTestId("trace-details-panel")
    await expect(within(runDetails).getByText(/^run$/i)).toBeInTheDocument()
    await expect(within(runDetails).getByText(/^live$/i)).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: /^sleep$/i }))
    const sleepDetails = await canvas.findByTestId("trace-details-panel")
    await expect(within(sleepDetails).getByText(/^sleep$/i)).toBeInTheDocument()
    await expect(within(sleepDetails).getByText(/^completed$/i)).toBeInTheDocument()
  },
}

export const SleepBehavior: Story = {
  args,
  render: () => <InteractiveStoryHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /^sleep$/i }))

    const sleepDetails = await canvas.findByTestId("trace-details-panel")
    await expect(within(sleepDetails).getByText(/^sleep$/i)).toBeInTheDocument()
    await expect(within(sleepDetails).getByText(/^completed$/i)).toBeInTheDocument()
    await expect(await within(sleepDetails).findByRole("button", { name: /Wake Up Sleep/i })).toBeInTheDocument()
    await expect(within(sleepDetails).queryByText(/No actions available\./i)).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: /more actions/i }))
    await expect(await canvas.findByRole("menuitem", { name: /Cancel Active Sleeps/i })).toBeInTheDocument()
  },
}

export const SelectRunFromInbox: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const targetRun = workflowInboxItemsMock[1]
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(targetRun.id, "i") }))
    await expect(onSelectInboxItem).toHaveBeenCalledWith(targetRun.id)
  },
}
