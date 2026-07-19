import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ButtonSwitcher } from "./ButtonSwitcher"

const meta: Meta<typeof ButtonSwitcher> = {
  title: "Composites/ButtonSwitcher",
  component: ButtonSwitcher,
  tags: ["autodocs"],
  args: {
    items: [
      { id: "1", name: "Alpha Workflow" },
      { id: "2", name: "Beta Workflow" },
      { id: "3", name: "Gamma Workflow" },
    ],
    activeId: "1",
    onSelect: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ButtonSwitcher>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    workflows: [],
    currentWorkflowId: undefined,
  },
}
