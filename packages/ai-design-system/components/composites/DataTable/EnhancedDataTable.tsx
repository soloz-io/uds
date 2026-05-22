import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MoreVertical, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3, Plus } from "lucide-react"
import { flexRender, type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/primitives/Badge"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Input } from "@/components/primitives/Input"
import { Label } from "@/components/primitives/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/primitives/Table"

import { DragHandleCell } from "./DragHandleCell"
import { DraggableRow } from "./DraggableRow"
import { InlineEditCell } from "./InlineEditCell"
import { ReviewerCell } from "./ReviewerCell"
import { RowDetailDrawer } from "./RowDetailDrawer"
import { StatusCell } from "./StatusCell"
import { createTableSelectColumn } from "./TableSelectColumn"
import type {
  DashboardInlineEditableField,
  DashboardRow,
  DashboardRowAction,
  DashboardTableActionHandlers,
} from "./table-types"
import { useEnhancedDataTable } from "./useEnhancedDataTable"

export interface EnhancedDataTableProps {
  data: DashboardRow[]
  className?: string
  handlers?: DashboardTableActionHandlers
  leftActions?: React.ReactNode
  rightActions?: React.ReactNode
  onCreateClick?: () => void
  createButtonLabel?: string
}

function useDashboardColumns(
  onSave: (rowId: number, field: "target" | "limit", value: string) => void,
  onAssignReviewer: (rowId: number, reviewer: string) => void,
  onUpdateRow: (rowId: number, key: keyof DashboardRow, value: string) => void,
  onRowAction?: (action: DashboardRowAction, row: DashboardRow) => void
): ColumnDef<DashboardRow>[] {
  return React.useMemo(
    () => [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandleCell id={row.original.id} />,
        enableSorting: false,
        enableHiding: false,
      },
      createTableSelectColumn(),
      {
        accessorKey: "header",
        header: "Header",
        cell: ({ row }) => <RowDetailDrawer item={row.original} onChange={onUpdateRow} />,
        enableHiding: false,
      },
      {
        accessorKey: "type",
        header: "Section Type",
        cell: ({ row }) => (
          <div className="w-32">
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              {row.original.type}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusCell status={row.original.status} />,
      },
      {
        accessorKey: "target",
        header: () => <div className="w-full text-right">Target</div>,
        cell: ({ row }) => <InlineEditCell row={row.original} field="target" onSave={onSave} />,
      },
      {
        accessorKey: "limit",
        header: () => <div className="w-full text-right">Limit</div>,
        cell: ({ row }) => <InlineEditCell row={row.original} field="limit" onSave={onSave} />,
      },
      {
        accessorKey: "reviewer",
        header: "Reviewer",
        cell: ({ row }) => <ReviewerCell row={row.original} onAssign={onAssignReviewer} />,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
                <MoreVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onRowAction?.("edit", row.original)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRowAction?.("copy", row.original)}>Make a copy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRowAction?.("favorite", row.original)}>Favorite</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onRowAction?.("delete", row.original)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onAssignReviewer, onRowAction, onSave, onUpdateRow]
  )
}

export function EnhancedDataTable({
  data: initialData,
  className,
  handlers,
  leftActions,
  rightActions,
  onCreateClick,
  createButtonLabel = "Create",
}: EnhancedDataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const [version, setVersion] = React.useState(0)
  const [mutableData, setMutableData] = React.useState<DashboardRow[]>(() => initialData)

  const updateRow = React.useCallback(
    (rowId: number, key: keyof DashboardRow, value: string) => {
      setMutableData((prev) => {
        const next = prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
        const updatedRow = next.find((row) => row.id === rowId)
        if (updatedRow) {
          handlers?.onRowUpdate?.(rowId, key, value, updatedRow)
        }
        return next
      })
      setVersion((prev) => prev + 1)
    },
    [handlers]
  )

  const handleInlineSave = React.useCallback(
    (rowId: number, field: DashboardInlineEditableField, value: string) => {
      const currentRow = mutableData.find((row) => row.id === rowId)
      if (currentRow) {
        handlers?.onInlineEditSave?.(rowId, field, value, { ...currentRow, [field]: value })
      }
      updateRow(rowId, field, value)
    },
    [handlers, mutableData, updateRow]
  )

  const handleAssignReviewer = React.useCallback(
    (rowId: number, reviewer: string) => {
      const currentRow = mutableData.find((row) => row.id === rowId)
      if (currentRow) {
        handlers?.onReviewerAssign?.(rowId, reviewer, { ...currentRow, reviewer })
      }
      updateRow(rowId, "reviewer", reviewer)
    },
    [handlers, mutableData, updateRow]
  )

  const columns = useDashboardColumns(
    handleInlineSave,
    handleAssignReviewer,
    updateRow,
    handlers?.onRowAction
  )

  const filteredData = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return mutableData
    }

    return mutableData.filter((row) =>
      [row.header, row.type, row.status, row.target, row.limit, row.reviewer]
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [mutableData, searchQuery])

  const { table, dataIds, reorderById } = useEnhancedDataTable({
    data: filteredData,
    columns,
    onReorder: (rows) => handlers?.onRowReorder?.(rows),
  })

  React.useEffect(() => {
    if (version > 0) {
      table.resetRowSelection(false)
    }
  }, [table, version])

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
  const sortableId = React.useId()

  const emitPaginationChange = React.useCallback(
    (pageIndex: number, pageSize: number) => {
      handlers?.onPaginationChange?.(pageIndex, pageSize)
    },
    [handlers]
  )

  React.useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
    const selectedIds = selectedRows.map((row) => row.id)
    handlers?.onRowSelectionChange?.(selectedIds, selectedRows)
  }, [handlers, table, table.getState().rowSelection])

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (active && over && active.id !== over.id) {
        reorderById(active.id, over.id)
      }
    },
    [reorderById]
  )

  const emitVisibleColumns = React.useCallback(() => {
    const visibleColumnIds = table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide() && column.getIsVisible())
      .map((column) => column.id)
    handlers?.onColumnsChange?.(visibleColumnIds)
  }, [handlers, table])

  return (
    <div className={`flex w-full flex-col justify-start gap-6 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex items-center gap-2 [&>button]:h-8">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Filter tasks..."
            className="h-8 w-[260px]"
            aria-label="Filter table rows"
          />
          {leftActions}
        </div>
        <div className="flex items-center gap-2 [&>button]:h-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Columns3 className="size-4" />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(!!value)
                      requestAnimationFrame(() => emitVisibleColumns())
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-8" onClick={onCreateClick}>
            <Plus className="size-4" />
            <span>{createButtonLabel}</span>
          </Button>
          {rightActions}
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  const pageSize = Number(value)
                  table.setPageSize(pageSize)
                  handlers?.onPageSizeChange?.(pageSize)
                  emitPaginationChange(table.getState().pagination.pageIndex, pageSize)
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => {
                  table.setPageIndex(0)
                  handlers?.onPageChange?.(0)
                  emitPaginationChange(0, table.getState().pagination.pageSize)
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => {
                  table.previousPage()
                  const nextIndex = Math.max(0, table.getState().pagination.pageIndex - 1)
                  handlers?.onPageChange?.(nextIndex)
                  emitPaginationChange(nextIndex, table.getState().pagination.pageSize)
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => {
                  table.nextPage()
                  const nextIndex = Math.min(table.getPageCount() - 1, table.getState().pagination.pageIndex + 1)
                  handlers?.onPageChange?.(nextIndex)
                  emitPaginationChange(nextIndex, table.getState().pagination.pageSize)
                }}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => {
                  const lastPage = Math.max(0, table.getPageCount() - 1)
                  table.setPageIndex(lastPage)
                  handlers?.onPageChange?.(lastPage)
                  emitPaginationChange(lastPage, table.getState().pagination.pageSize)
                }}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
