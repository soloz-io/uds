import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Toaster } from "sonner"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema } from "ui-schema-contracts"

import { EnhancedDataTable } from "./EnhancedDataTable"
import type { DashboardRow } from "./table-types"

const data: DashboardRow[] = [
  { id: 1, header: "Cover page", type: "Cover page", status: "In Process", target: "18", limit: "5", reviewer: "Eddie Lake" },
  { id: 2, header: "Table of contents", type: "Table of contents", status: "Done", target: "29", limit: "24", reviewer: "Eddie Lake" },
  { id: 3, header: "Executive summary", type: "Narrative", status: "Done", target: "10", limit: "13", reviewer: "Eddie Lake" },
  { id: 4, header: "Technical approach", type: "Narrative", status: "Done", target: "27", limit: "23", reviewer: "Jamik Tashpulatov" },
  { id: 5, header: "Design", type: "Narrative", status: "In Process", target: "2", limit: "16", reviewer: "Jamik Tashpulatov" },
  { id: 6, header: "Capabilities", type: "Narrative", status: "In Process", target: "20", limit: "8", reviewer: "Jamik Tashpulatov" },
  { id: 7, header: "Integration with existing systems", type: "Narrative", status: "In Process", target: "19", limit: "21", reviewer: "Assign reviewer" },
  { id: 8, header: "Innovation and Advantages", type: "Narrative", status: "Done", target: "25", limit: "26", reviewer: "Assign reviewer" },
  { id: 9, header: "Overview of EMR's Innovative Solutions", type: "Technical content", status: "Done", target: "7", limit: "23", reviewer: "Assign reviewer" },
  { id: 10, header: "Advanced Algorithms and Machine Learning", type: "Narrative", status: "Done", target: "30", limit: "28", reviewer: "Assign reviewer" },
  { id: 11, header: "Adaptive Communication Protocols", type: "Narrative", status: "Done", target: "9", limit: "31", reviewer: "Assign reviewer" },
  { id: 12, header: "Advantages Over Current Technologies", type: "Narrative", status: "Not Started", target: "12", limit: "0", reviewer: "Assign reviewer" },
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
  title: "Composites/EnhancedDataTable",
  component: EnhancedDataTable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <>
      <EnhancedDataTable {...args} />
      <Toaster position="bottom-right" />
    </>
  ),
} satisfies Meta<typeof EnhancedDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data,
    tableSchema,
  },
}
