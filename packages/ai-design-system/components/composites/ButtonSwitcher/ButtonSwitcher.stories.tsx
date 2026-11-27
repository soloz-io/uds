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

/** Items in groups: the menu lists each group once and opens its items on demand; an ungrouped item is listed directly. */
export const Grouped: Story = {
  args: {
    items: [
      { id: "golden-evals", name: "Golden Evals", group: "Grading" },
      { id: "recommendations", name: "Recommendations", group: "Grading" },
      { id: "turns", name: "Turns", group: "Session" },
      { id: "outputs", name: "Outputs", group: "Session" },
      { id: "improvement", name: "Improvement" },
      { id: "workflow", name: "Workflow", group: "Eval run" },
    ],
    activeId: "turns",
    onSelect: () => {},
  },
}
