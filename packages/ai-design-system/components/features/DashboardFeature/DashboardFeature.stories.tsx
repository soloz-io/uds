import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Toaster } from "sonner"

import { DashboardFeature } from "./DashboardFeature"
import {
  dashboardKpis,
  dashboardRows,
  visitorsSeries,
} from "./DashboardFeature.mocks"
import { useDashboardFeatureMock } from "./useDashboardFeature.mock"

const meta = {
  title: "Features/DashboardFeature",
  component: DashboardFeature,
  tags: ["autodocs"],
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

export const Default: Story = {
  args: {
    kpis: dashboardKpis,
    rows: dashboardRows,
    visitorsSeries,
  },
}

export const WithStateManagement: Story = {
  args: {
    kpis: dashboardKpis,
    rows: dashboardRows,
    visitorsSeries,
  },
  render: () => {
    const state = useDashboardFeatureMock()

    return (
      <>
        <DashboardFeature {...state} />
        <Toaster position="bottom-right" />
      </>
    )
  },
}
