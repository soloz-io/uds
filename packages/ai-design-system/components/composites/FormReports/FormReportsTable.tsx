import * as React from "react"
import {
  EnhancedDataTable,
  type DashboardPaginationState,
  type DashboardRow,
  type DashboardRowAction,
  type DashboardTableActionHandlers,
} from "@/components/composites/DataTable"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema, type DynamicTableSchema, type TableColumn } from "ui-schema-contracts"

export interface FormReportsEntity {
  id: number | string
  [key: string]: unknown
}

export type FormReportsColumn = TableColumn

export interface FormReportsRowAction {
  key: string
  label: string
}

export interface FormReportsTableHandlers {
  onCreateClick?: () => void
  onAddSection?: () => void
  onColumnsChange?: (visibleColumnKeys: string[]) => void
  onRowReorder?: (rows: FormReportsEntity[]) => void
  onEditModeChange?: (rowId: number | string | null, row?: FormReportsEntity) => void
  onEditRow?: (row: FormReportsEntity) => void
  onCopyRow?: (row: FormReportsEntity) => void
  onFavoriteRow?: (row: FormReportsEntity) => void
  onDeleteRow?: (row: FormReportsEntity) => void
  onRowUpdate?: (rowId: number | string, key: string, value: string, row: FormReportsEntity) => void
  onInlineEditSave?: (rowId: number | string, field: string, value: string, row: FormReportsEntity) => void
  onReviewerAssign?: (rowId: number | string, reviewer: string, row: FormReportsEntity) => void
  onRowAction?: (action: string, row: FormReportsEntity) => void
  onRowSelectionChange?: (selectedRowIds: Array<number | string>, selectedRows: FormReportsEntity[]) => void
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (pageIndex: number) => void
  onRowClick?: (row: FormReportsEntity) => void
}

export interface FormReportsTableProps {
  items: FormReportsEntity[]
  columns: FormReportsColumn[]
  rowActions?: FormReportsRowAction[]
  pagination?: DashboardPaginationState
  handlers?: FormReportsTableHandlers
  leftActions?: React.ReactNode
  rightActions?: React.ReactNode
  onCreateClick?: () => void
  createButtonLabel?: string
  enableRowSelection?: boolean
}

const dashboardToFormReportsActionMap: Record<DashboardRowAction, string> = {
  edit: "edit",
  copy: "duplicate",
  favorite: "favorite",
  delete: "delete",
}

export type { DashboardPaginationState }

export const FormReportsTable = React.memo<FormReportsTableProps>(
  ({ items, columns, pagination, handlers, leftActions, rightActions, onCreateClick, createButtonLabel, enableRowSelection }) => {
    const { rows, originalById, tableSchema } = React.useMemo(() => {
      const byId = new Map<string, FormReportsEntity>()
      const tableColumns: DynamicTableSchema["columns"] = columns

      const nextRows = items.map((item, index) => {
        const rawId = item.id
        const id = rawId === null || rawId === undefined ? String(index + 1) : String(rawId)
        const row: DashboardRow = {
          ...item,
          id,
        }
        byId.set(String(id), item)
        return row
      })

      return {
        rows: nextRows,
        originalById: byId,
        tableSchema: dynamicTableSchema.parse({
          schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
          rowKey: "id",
          columns: tableColumns,
          enableFiltering: true,
          enablePagination: true,
          enableRowSelection: enableRowSelection ?? true,
        }),
      }
    }, [columns, items, enableRowSelection])

    const adaptedHandlers = React.useMemo<DashboardTableActionHandlers>(
      () => ({
        onCreateClick: () => handlers?.onCreateClick?.(),
        onAddSection: () => handlers?.onAddSection?.(),
        onColumnsChange: (visibleColumnIds) => handlers?.onColumnsChange?.(visibleColumnIds),
        onRowReorder: (nextRows) => {
          const nextOriginalRows = nextRows
            .map((row) => originalById.get(String(row.id)))
            .filter((row): row is FormReportsEntity => Boolean(row))
          handlers?.onRowReorder?.(nextOriginalRows)
        },
        onEditModeChange: (rowId, row) => {
          if (rowId === null) {
            handlers?.onEditModeChange?.(null)
            return
          }
          const originalRow = originalById.get(String(row?.id ?? rowId))
          handlers?.onEditModeChange?.(rowId, originalRow)
        },
        onEditRow: (row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onEditRow?.(originalRow)
        },
        onCopyRow: (row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onCopyRow?.(originalRow)
        },
        onFavoriteRow: (row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onFavoriteRow?.(originalRow)
        },
        onDeleteRow: (row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onDeleteRow?.(originalRow)
        },
        onRowUpdate: (rowId, key, value, row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onRowUpdate?.(rowId, key, value, originalRow)
        },
        onInlineEditSave: (rowId, key, value, row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onInlineEditSave?.(rowId, key, value, originalRow)
        },
        onReviewerAssign: (rowId, reviewer, row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onReviewerAssign?.(rowId, reviewer, originalRow)
        },
        onRowAction: (action, row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onRowAction?.(dashboardToFormReportsActionMap[action] ?? action, originalRow)
        },
        onRowSelectionChange: (selectedIds, selectedRows) => {
          const selectedOriginalRows = selectedRows
            .map((row) => originalById.get(String(row.id)))
            .filter((row): row is FormReportsEntity => Boolean(row))
          const selectedOriginalIds = selectedOriginalRows.map((row) => row.id)
          handlers?.onRowSelectionChange?.(selectedOriginalIds, selectedOriginalRows)
          if (selectedOriginalRows.length === 0 && selectedIds.length === 0) {
            handlers?.onRowSelectionChange?.([], [])
          }
        },
        onPaginationChange: (pageIndex, pageSize) => handlers?.onPaginationChange?.(pageIndex, pageSize),
        onPageSizeChange: (pageSize) => handlers?.onPageSizeChange?.(pageSize),
        onPageChange: (pageIndex) => handlers?.onPageChange?.(pageIndex),
        onRowClick: (row) => {
          const originalRow = originalById.get(String(row.id))
          if (!originalRow) return
          handlers?.onRowClick?.(originalRow)
        }
      }),
      [handlers, originalById]
    )

    return (
      <EnhancedDataTable
        data={rows}
        tableSchema={tableSchema}
        pagination={pagination}
        handlers={adaptedHandlers}
        leftActions={leftActions}
        rightActions={rightActions}
        onCreateClick={onCreateClick}
        createButtonLabel={createButtonLabel}
      />
    )
  }
)

FormReportsTable.displayName = "FormReportsTable"
