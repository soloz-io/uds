import { z } from "zod"

export const dashboardRowSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.enum(["In Process", "Done", "Not Started"]),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export type DashboardRow = z.infer<typeof dashboardRowSchema>

export type DashboardInlineEditableField = "target" | "limit"

export type DashboardRowAction = "edit" | "copy" | "favorite" | "delete"

export interface DashboardTableActionHandlers {
  onCreateClick?: () => void
  onAddSection?: () => void
  onColumnsChange?: (visibleColumnIds: string[]) => void
  onRowReorder?: (rows: DashboardRow[]) => void
  onRowUpdate?: (rowId: number, key: keyof DashboardRow, value: string, row: DashboardRow) => void
  onInlineEditSave?: (rowId: number, field: DashboardInlineEditableField, value: string, row: DashboardRow) => void
  onReviewerAssign?: (rowId: number, reviewer: string, row: DashboardRow) => void
  onRowAction?: (action: DashboardRowAction, row: DashboardRow) => void
  onRowSelectionChange?: (selectedRowIds: number[], selectedRows: DashboardRow[]) => void
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (pageIndex: number) => void
}
