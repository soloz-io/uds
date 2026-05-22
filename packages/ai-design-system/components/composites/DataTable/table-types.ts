import { z } from "zod"
import type { DynamicTableSchema } from "ui-schema-contracts"

export const dashboardRowSchema = z.object({
  id: z.union([z.number(), z.string()]),
}).passthrough()

export const defaultDashboardTableSchema: DynamicTableSchema = {
  schemaVersion: "2",
  rowKey: "id",
  columns: [
    {
      key: "header",
      label: "Header",
      renderType: "text",
      inputType: "text",
      editable: true,
      align: "left",
      sortable: true,
      filterable: true,
      hideable: false,
      required: false,
    },
    {
      key: "type",
      label: "Section Type",
      renderType: "badge",
      inputType: "none",
      editable: false,
      align: "left",
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "status",
      label: "Status",
      renderType: "status",
      inputType: "select",
      editable: true,
      align: "left",
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "target",
      label: "Target",
      renderType: "text",
      inputType: "number",
      editable: true,
      align: "right",
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "limit",
      label: "Limit",
      renderType: "text",
      inputType: "number",
      editable: true,
      align: "right",
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "reviewer",
      label: "Reviewer",
      renderType: "text",
      inputType: "select",
      editable: true,
      align: "left",
      options: [
        { label: "Eddie Lake", value: "Eddie Lake" },
        { label: "Jamik Tashpulatov", value: "Jamik Tashpulatov" },
        { label: "Emily Whalen", value: "Emily Whalen" },
      ],
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
  ],
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: true,
}

export type DashboardRow = z.infer<typeof dashboardRowSchema>

export type DashboardInlineEditableField = "target" | "limit"

export type DashboardRowAction = "edit" | "copy" | "favorite" | "delete"

export interface DashboardTableActionHandlers {
  onCreateClick?: () => void
  onAddSection?: () => void
  onColumnsChange?: (visibleColumnIds: string[]) => void
  onRowReorder?: (rows: DashboardRow[]) => void
  onRowUpdate?: (rowId: number | string, key: string, value: string, row: DashboardRow) => void
  onInlineEditSave?: (rowId: number | string, field: string, value: string, row: DashboardRow) => void
  onReviewerAssign?: (rowId: number | string, reviewer: string, row: DashboardRow) => void
  onRowAction?: (action: DashboardRowAction, row: DashboardRow) => void
  onRowSelectionChange?: (selectedRowIds: Array<number | string>, selectedRows: DashboardRow[]) => void
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (pageIndex: number) => void
}
