import { z } from "zod"

export const dashboardRowSchema = z.object({
  id: z.union([z.number(), z.string()]),
}).passthrough()

export type DashboardRow = z.infer<typeof dashboardRowSchema>

export type DashboardInlineEditableField = "target" | "limit"

export type DashboardRowAction = "edit" | "copy" | "favorite" | "delete"

export interface DashboardTableActionHandlers {
  onCreateClick?: () => void
  onAddSection?: () => void
  onColumnsChange?: (visibleColumnIds: string[]) => void
  onRowReorder?: (rows: DashboardRow[]) => void
  onEditModeChange?: (rowId: number | string | null, row?: DashboardRow) => void
  onRowUpdate?: (rowId: number | string, key: string, value: string, row: DashboardRow) => void
  onInlineEditSave?: (rowId: number | string, field: string, value: string, row: DashboardRow) => void
  onReviewerAssign?: (rowId: number | string, reviewer: string, row: DashboardRow) => void
  onRowAction?: (action: DashboardRowAction, row: DashboardRow) => void
  onRowSelectionChange?: (selectedRowIds: Array<number | string>, selectedRows: DashboardRow[]) => void
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (pageIndex: number) => void
}
