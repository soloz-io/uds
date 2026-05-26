import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, within } from "@storybook/test"
import { Toaster } from "sonner"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema } from "ui-schema-contracts"

import { EnhancedDataTable } from "./EnhancedDataTable"
import type { DashboardRow } from "./table-types"

const rows: DashboardRow[] = [
  { id: 1, header: "Cover page", type: "Cover page", status: "In Process", target: "18", limit: "5", reviewer: "Eddie Lake" },
  { id: 2, header: "Table of contents", type: "Table of contents", status: "Done", target: "29", limit: "24", reviewer: "Assign reviewer" },
  { id: 3, header: "Executive summary", type: "Narrative", status: "Done", target: "10", limit: "13", reviewer: "Assign reviewer" },
]

const tableSchema = dynamicTableSchema.parse({
  schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
  rowKey: "id",
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: true,
  columns: [
    { key: "header", label: "Header", sortable: true, hideable: false },
    { key: "type", label: "Type", sortable: true },
    { key: "status", label: "Status", renderType: "badge", sortable: true },
    { key: "target", label: "Target", align: "right", sortable: true },
    { key: "limit", label: "Limit", align: "right", sortable: true },
    { key: "reviewer", label: "Reviewer", sortable: true },
  ],
})

const meta = {
  title: "Composites/EnhancedDataTable/Behaviors",
  component: EnhancedDataTable,
  tags: ["test"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <>
      <EnhancedDataTable {...args} />
      <Toaster position="bottom-right" />
    </>
  ),
} satisfies Meta<typeof EnhancedDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const SelectAllWorks: Story = {
  args: { data: rows, tableSchema },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selectAll = canvas.getByLabelText("Select all")
    await userEvent.click(selectAll)
    await expect(selectAll).toBeChecked()
  },
}

export const DrawerOpensFromHeader: Story = {
  args: { data: rows, tableSchema },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Cover page" })
    await userEvent.click(trigger)
    await expect(await canvas.findByText("Showing total visitors for the last 6 months")).toBeInTheDocument()
  },
}

export const SwitchesViewTab: Story = {
  args: { data: rows, tableSchema },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tab = canvas.getByRole("tab", { name: /Past Performance/i })
    await userEvent.click(tab)
    await expect(canvas.getByRole("tabpanel")).toBeInTheDocument()
  },
}
