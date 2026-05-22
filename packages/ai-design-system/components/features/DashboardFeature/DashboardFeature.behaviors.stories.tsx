import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "@storybook/test"
import { Toaster } from "sonner"

import { DashboardFeature } from "./DashboardFeature"
import {
  dashboardKpis,
  dashboardRows,
  visitorsSeries,
} from "./DashboardFeature.mocks"

const meta = {
  title: "Features/DashboardFeature/Behaviors",
  component: DashboardFeature,
  tags: ["test"],
  globals: {
    theme: "dark-neutral",
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <>
      <DashboardFeature {...args} />
      <Toaster position="bottom-right" />
    </>
  ),
} satisfies Meta<typeof DashboardFeature>

export default meta
type Story = StoryObj<typeof meta>

const args = {
  kpis: dashboardKpis,
  rows: dashboardRows,
  visitorsSeries,
}

const interactionSpy = fn()

export const SelectAllRows: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selectAll = canvas.getByLabelText("Select all")
    await userEvent.click(selectAll)
    interactionSpy("select-all")
    await expect(selectAll).toBeChecked()
    await expect(interactionSpy).toHaveBeenCalled()
  },
}

export const OpenRowDrawer: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const coverButton = canvas.getByRole("button", { name: "Cover page" })
    await userEvent.click(coverButton)
    interactionSpy("open-drawer")
    await expect(await canvas.findByText("Showing total visitors for the last 6 months")).toBeInTheDocument()
  },
}

export const TogglePastPerformanceTab: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tab = canvas.getByRole("tab", { name: /Past Performance/i })
    await userEvent.click(tab)
    interactionSpy("toggle-tab")
    await expect(canvas.getByRole("tabpanel")).toBeInTheDocument()
  },
}
