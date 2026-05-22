import * as React from "react"
import {
  EnhancedDataTable,
  type DashboardRow,
  type DashboardRowAction,
  type DashboardTableActionHandlers,
} from "@/components/composites/DataTable"
import type { DynamicTableSchema, TableColumn } from "ui-schema-contracts"

export interface FormReportsEntity {
  id: number | string
  [key: string]: unknown
}

export interface FormReportsColumn {
  key: TableColumn["key"]
  label: TableColumn["label"]
  align?: TableColumn["align"]
  renderType?: TableColumn["renderType"]
  inputType?: TableColumn["inputType"]
  editable?: TableColumn["editable"]
  placeholder?: TableColumn["placeholder"]
  options?: TableColumn["options"]
  sortable?: TableColumn["sortable"]
  filterable?: TableColumn["filterable"]
  hideable?: TableColumn["hideable"]
  format?: TableColumn["format"]
  meta?: TableColumn["meta"]
}

export interface FormReportsRowAction {
  key: string
  label: string
}

export interface FormReportsTableHandlers {
  onColumnsChange?: (visibleColumnKeys: string[]) => void
  onRowAction?: (action: string, row: FormReportsEntity) => void
  onRowSelectionChange?: (selectedRowIds: Array<number | string>, selectedRows: FormReportsEntity[]) => void
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
}

export interface FormReportsTableProps {
  items: FormReportsEntity[]
  columns: FormReportsColumn[]
  rowActions?: FormReportsRowAction[]
  handlers?: FormReportsTableHandlers
  leftActions?: React.ReactNode
  rightActions?: React.ReactNode
  onCreateClick?: () => void
  createButtonLabel?: string
}

const dashboardToFormReportsActionMap: Record<DashboardRowAction, string> = {
  edit: "edit",
  copy: "duplicate",
  favorite: "favorite",
  delete: "delete",
}

export const FormReportsTable = React.memo<FormReportsTableProps>(
  ({ items, columns, handlers, leftActions, rightActions, onCreateClick, createButtonLabel }) => {
    const { rows, originalById, tableSchema } = React.useMemo(() => {
      const byId = new Map<string, FormReportsEntity>()
      const tableColumns: DynamicTableSchema["columns"] = columns.map((column) => ({
        key: column.key,
        label: column.label,
        align: column.align ?? "left",
        renderType: column.renderType ?? "text",
        inputType: column.inputType ?? "none",
        editable: column.editable ?? false,
        placeholder: column.placeholder,
        options: column.options,
        sortable: column.sortable ?? true,
        filterable: column.filterable ?? true,
        hideable: column.hideable ?? true,
        format: column.format,
        meta: column.meta,
      }))

      const nextRows = items.map((item, index) => {
        const rawId = item.id
        const id = rawId === null || rawId === undefined ? String(index + 1) : String(rawId)
        const row: DashboardRow = {
          id,
          ...item,
        }
        byId.set(String(id), item)
        return row
      })

      return {
        rows: nextRows,
        originalById: byId,
        tableSchema: {
          schemaVersion: "2",
          rowKey: "id",
          columns: tableColumns,
          enableFiltering: true,
          enablePagination: true,
          enableRowSelection: true,
        } satisfies DynamicTableSchema,
      }
    }, [columns, items])

    const adaptedHandlers = React.useMemo<DashboardTableActionHandlers>(
      () => ({
        onColumnsChange: (visibleColumnIds) => handlers?.onColumnsChange?.(visibleColumnIds),
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
      }),
      [handlers, originalById]
    )

    return (
      <EnhancedDataTable
        data={rows}
        tableSchema={tableSchema}
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
