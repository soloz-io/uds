import * as React from "react"
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { arrayMove, type UniqueIdentifier } from "@dnd-kit/sortable"

import type { DashboardRow } from "./table-types"

export interface UseEnhancedDataTableOptions {
  data: DashboardRow[]
  columns: ColumnDef<DashboardRow>[]
  onReorder?: (rows: DashboardRow[]) => void
}

export function useEnhancedDataTable({ data: initialData, columns, onReorder }: UseEnhancedDataTableOptions) {
  const [data, setData] = React.useState<DashboardRow[]>(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map((item) => item.id), [data])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const reorderById = React.useCallback(
    (activeId: UniqueIdentifier, overId: UniqueIdentifier) => {
      if (activeId === overId) {
        return
      }

      setData((prev) => {
        const ids = prev.map((item) => String(item.id))
        const oldIndex = ids.indexOf(String(activeId))
        const newIndex = ids.indexOf(String(overId))
        if (oldIndex < 0 || newIndex < 0) {
          return prev
        }
        const next = arrayMove(prev, oldIndex, newIndex)
        onReorder?.(next)
        return next
      })
    },
    [onReorder]
  )

  const updateCell = React.useCallback((rowId: number | string, key: string, value: string) => {
    setData((prev) => prev.map((row) => (String(row.id) === String(rowId) ? { ...row, [key]: value } : row)))
  }, [])

  return {
    data,
    table,
    dataIds,
    updateCell,
    reorderById,
  }
}
