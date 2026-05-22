import * as React from "react"
import {
  EnhancedDataTable,
  type DashboardRow,
  type DashboardRowAction,
  type DashboardTableActionHandlers,
} from "@/components/composites/DataTable"

export interface FormReportsEntity {
  id: number | string
  [key: string]: unknown
}

export interface FormReportsColumn {
  key: string
  label: string
  align?: "left" | "center" | "right"
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

const statusMap: Record<string, DashboardRow["status"]> = {
  "in process": "In Process",
  done: "Done",
  "not started": "Not Started",
}

const dashboardToFormReportsColumnMap: Record<string, string> = {
  header: "name",
  type: "sectionType",
  status: "status",
  target: "target",
  limit: "limit",
  reviewer: "reviewer",
}

const dashboardToFormReportsActionMap: Record<DashboardRowAction, string> = {
  edit: "edit",
  copy: "duplicate",
  favorite: "favorite",
  delete: "delete",
}

function normalize(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }
  return String(value).toLowerCase()
}

function toDashboardStatus(value: unknown): DashboardRow["status"] {
  const normalized = normalize(value)
  return statusMap[normalized] ?? "Not Started"
}

function toDisplayString(value: unknown, fallback = "-"): string {
  if (value === null || value === undefined || value === "") {
    return fallback
  }
  return String(value)
}

export const FormReportsTable = React.memo<FormReportsTableProps>(
  ({ items, columns, handlers, leftActions, rightActions, onCreateClick, createButtonLabel }) => {
    const { rows, originalById } = React.useMemo(() => {
      const byId = new Map<number, FormReportsEntity>()
      const nextRows = items.map((item, index) => {
        const rawId = item.id
        const id = typeof rawId === "number" ? rawId : index + 1
        const row: DashboardRow = {
          id,
          header: toDisplayString(item.name),
          type: toDisplayString(item.sectionType ?? item.type, "Custom"),
          status: toDashboardStatus(item.status),
          target: toDisplayString(item.target, "0"),
          limit: toDisplayString(item.limit, "0"),
          reviewer: toDisplayString(item.reviewer, "Assign reviewer"),
        }
        byId.set(id, item)
        return row
      })

      return { rows: nextRows, originalById: byId }
    }, [items])

    const adaptedHandlers = React.useMemo<DashboardTableActionHandlers>(
      () => ({
        onColumnsChange: (visibleColumnIds) => {
          const mappedKeys = visibleColumnIds.map((id) => dashboardToFormReportsColumnMap[id] ?? id)
          handlers?.onColumnsChange?.(mappedKeys)
        },
        onRowAction: (action, row) => {
          const originalRow = originalById.get(row.id)
          if (!originalRow) return
          handlers?.onRowAction?.(dashboardToFormReportsActionMap[action] ?? action, originalRow)
        },
        onRowSelectionChange: (selectedIds, selectedRows) => {
          const selectedOriginalRows = selectedRows
            .map((row) => originalById.get(row.id))
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
