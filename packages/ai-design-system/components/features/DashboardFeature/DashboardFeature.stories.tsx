import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Toaster } from "sonner"

import { DashboardFeature } from "./DashboardFeature"
import {
  dashboardCreateFields,
  dashboardKpis,
  dashboardRows,
  dashboardTableSchema,
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
    tableSchema: dashboardTableSchema,
    visitorsSeries,
    createFields: dashboardCreateFields,
  },
}

export const WithStateManagement: Story = {
  args: {
    kpis: dashboardKpis,
    rows: dashboardRows,
    tableSchema: dashboardTableSchema,
    visitorsSeries,
    createFields: dashboardCreateFields,
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

export const EmptyState: Story = {
  args: {
    kpis: [],
    rows: [],
    tableSchema: dashboardTableSchema,
    visitorsSeries: [],
    createFields: [
      { name: "name", label: "App Name", type: "text", required: true },
      { name: "description", label: "Description", type: "text" },
    ],
    emptyState: {
      title: "Create your first App",
      description: "Get started by creating a new app to build workflows and manage tasks.",
      actionLabel: "Create App",
    },
    quickCreateFields: [
      { name: "name", label: "App Name", type: "text", required: true },
    ],
  },
}
