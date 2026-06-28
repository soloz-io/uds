import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { WorkflowSwitcher } from "./WorkflowSwitcher"

const meta: Meta<typeof WorkflowSwitcher> = {
  title: "Composites/WorkflowSwitcher",
  component: WorkflowSwitcher,
  parameters: {
    layout: "centered",
  },
  args: {
    workflows: [
      { id: "1", name: "Alpha Workflow" },
      { id: "2", name: "Beta Workflow" },
      { id: "3", name: "Gamma Workflow" },
    ],
    currentWorkflowId: "1",
    onSelectWorkflow: () => {},
  },
}

export default meta
type Story = StoryObj<typeof WorkflowSwitcher>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    workflows: [],
    currentWorkflowId: undefined,
  },
}
