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
import type { DynamicTableSchema, TableColumn } from "ui-schema-contracts"

import { Badge } from "@/components/primitives/Badge"
import { Button } from "@/components/primitives/Button"
import { Checkbox } from "@/components/primitives/Checkbox"
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
import { Progress } from "@/components/primitives/Progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/Select"
import { Textarea } from "@/components/primitives/Textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/primitives/Table"

import { DragHandleCell } from "./DragHandleCell"
import { DraggableRow } from "./DraggableRow"
import { createTableSelectColumn } from "./TableSelectColumn"
import type {
  DashboardRow,
  DashboardTableActionHandlers,
} from "./table-types"
import { useEnhancedDataTable } from "./useEnhancedDataTable"

export interface EnhancedDataTableProps {
  data: DashboardRow[]
  tableSchema: DynamicTableSchema
  className?: string
  handlers?: DashboardTableActionHandlers
  leftActions?: React.ReactNode
  rightActions?: React.ReactNode
  onCreateClick?: () => void
  createButtonLabel?: string
}

function toRowId(row: DashboardRow, schema: DynamicTableSchema): number | string {
  const key = schema.rowKey ?? "id"
  const value = row[key]
  if (typeof value === "number" || typeof value === "string") {
    return value
  }
  const fallback = row.id
  if (typeof fallback === "number" || typeof fallback === "string") {
    return fallback
  }
  return String(value ?? "")
}

function alignClass(align: TableColumn["align"]): string {
  if (align === "right") return "text-right"
  if (align === "center") return "text-center"
  return "text-left"
}

function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value)
}

function toNumberValue(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function EnhancedDataTable({
  data: initialData,
  tableSchema,
  className,
  handlers,
  leftActions,
  rightActions,
  onCreateClick,
  createButtonLabel = "Create",
}: EnhancedDataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [version, setVersion] = React.useState(0)
  const [mutableData, setMutableData] = React.useState<DashboardRow[]>(() => initialData)
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

  // Intentional sync: update local mutable copy when parent data changes.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMutableData(initialData)
  }, [initialData])

  const updateRow = React.useCallback(
    (rowId: number | string, key: string, value: string) => {
      setMutableData((prev) => {
        const next = prev.map((row) => (String(toRowId(row, tableSchema)) === String(rowId) ? { ...row, [key]: value } : row))
        const updatedRow = next.find((row) => String(toRowId(row, tableSchema)) === String(rowId))
        if (updatedRow) {
          handlers?.onRowUpdate?.(rowId, key, value, updatedRow)
        }
        return next
      })
      setVersion((prev) => prev + 1)
    },
    [handlers, tableSchema]
  )

  const handleInlineSave = React.useCallback(
    (rowId: number | string, key: string, value: string) => {
      const currentRow = mutableData.find((row) => String(toRowId(row, tableSchema)) === String(rowId))
      if (currentRow) {
        handlers?.onInlineEditSave?.(rowId, key, value, { ...currentRow, [key]: value })
      }
      if (key === "reviewer") {
        handlers?.onReviewerAssign?.(rowId, value, { ...(currentRow ?? {}), reviewer: value } as DashboardRow)
      }
      updateRow(rowId, key, value)
    },
    [handlers, mutableData, tableSchema, updateRow]
  )

  React.useEffect(() => {
    if (!editingRowId) return
    const rowStillExists = mutableData.some((row) => String(toRowId(row, tableSchema)) === editingRowId)
    if (!rowStillExists) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingRowId(null)
      handlers?.onEditModeChange?.(null)
    }
  }, [editingRowId, handlers, mutableData, tableSchema])

  React.useEffect(() => {
    if (!editingRowId) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const activeOverlay = target.closest('[data-slot="select-content"], [data-slot="select-item"]')
      if (activeOverlay) {
        return
      }

      const clickedRowId = target.closest("tr[data-row-id]")?.getAttribute("data-row-id")
      if (clickedRowId === editingRowId) {
        return
      }

      const editedRowExists = containerRef.current?.querySelector(`tr[data-row-id="${editingRowId}"]`)
      if (!editedRowExists) {
        setEditingRowId(null)
        handlers?.onEditModeChange?.(null)
        return
      }

      setEditingRowId(null)
      handlers?.onEditModeChange?.(null)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [editingRowId, handlers])

  const emitRowAction = React.useCallback(
    (action: DashboardRowAction, row: DashboardRow) => {
      if (action === "edit") {
        handlers?.onEditRow?.(row)
      }
      if (action === "copy") {
        handlers?.onCopyRow?.(row)
      }
      if (action === "favorite") {
        handlers?.onFavoriteRow?.(row)
      }
      if (action === "delete") {
        handlers?.onDeleteRow?.(row)
      }
      handlers?.onRowAction?.(action, row)
    },
    [handlers]
  )

  const renderEditableCell = React.useCallback(
    (row: DashboardRow, column: TableColumn, rawValue: unknown) => {
      const rowId = toRowId(row, tableSchema)
      const value = toDisplayValue(rawValue)
      const inputType = column.inputType ?? "none"

      if (inputType === "select") {
        return (
          <Select value={value} onValueChange={(nextValue) => handleInlineSave(rowId, column.key, nextValue)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder={column.placeholder ?? "Select"} />
            </SelectTrigger>
            <SelectContent align="end">
              {(column.options ?? []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      if (inputType === "boolean") {
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={String(value).toLowerCase() === "true"}
              onCheckedChange={(checked) => handleInlineSave(rowId, column.key, checked ? "true" : "false")}
              aria-label={`Toggle ${column.label}`}
            />
          </div>
        )
      }

      if (inputType === "textarea") {
        return (
          <Textarea
            value={value}
            placeholder={column.placeholder}
            onChange={(event) => handleInlineSave(rowId, column.key, event.target.value)}
            rows={2}
            className="min-w-[220px]"
          />
        )
      }

      const htmlInputType = inputType === "date" ? "date" : inputType === "number" ? "number" : "text"
      return (
        <Input
          value={value}
          type={htmlInputType}
          placeholder={column.placeholder}
          className={column.align === "right" ? "h-8 text-right" : "h-8"}
          onChange={(event) => handleInlineSave(rowId, column.key, event.target.value)}
        />
      )
    },
    [handleInlineSave, tableSchema]
  )

  const renderReadonlyCell = React.useCallback((column: TableColumn, rawValue: unknown) => {
    const renderType = column.renderType ?? "text"
    const value = toDisplayValue(rawValue)

    if (renderType === "badge" || renderType === "status") {
      return (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {value}
        </Badge>
      )
    }

    if (renderType === "progress") {
      const progress = Math.max(0, Math.min(100, toNumberValue(rawValue)))
      return (
        <div className="flex min-w-[160px] items-center gap-2">
          <Progress value={progress} />
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
      )
    }

    if (renderType === "boolean") {
      return <span>{String(value).toLowerCase() === "true" ? "Yes" : "No"}</span>
    }

    return <span>{value}</span>
  }, [])

  const columns = React.useMemo<ColumnDef<DashboardRow>[]>(() => {
    const dynamicColumns: ColumnDef<DashboardRow>[] = [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandleCell id={toRowId(row.original, tableSchema)} />,
        enableSorting: false,
        enableHiding: false,
      },
    ]

    if (tableSchema.enableRowSelection !== false) {
      dynamicColumns.push(createTableSelectColumn())
    }

    dynamicColumns.push(
      ...tableSchema.columns.map<ColumnDef<DashboardRow>>((column: TableColumn) => ({
        id: column.key,
        accessorKey: column.key,
        header: () => <div className={alignClass(column.align)}>{column.label}</div>,
        enableSorting: column.sortable ?? true,
        enableHiding: column.hideable ?? true,
        cell: (cellContext) => {
          const { row } = cellContext
          const rawValue = row.original[column.key]
          const rowId = String(toRowId(row.original, tableSchema))
          const isRowEditing = editingRowId === rowId
          if (isRowEditing && (column.editable ?? false) && (column.inputType ?? "none") !== "none") {
            return renderEditableCell(row.original, column, rawValue)
          }
          return (
            <div className={alignClass(column.align)}>
              {renderReadonlyCell(column, rawValue)}
            </div>
          )
        },
      }))
    )

    dynamicColumns.push({
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
            <DropdownMenuItem
              onClick={() => {
                setEditingRowId(String(toRowId(row.original, tableSchema)))
                emitRowAction("edit", row.original)
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => emitRowAction("copy", row.original)}>Make a copy</DropdownMenuItem>
            <DropdownMenuItem onClick={() => emitRowAction("favorite", row.original)}>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (editingRowId === String(toRowId(row.original, tableSchema))) {
                  setEditingRowId(null)
                }
                emitRowAction("delete", row.original)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    })

    return dynamicColumns
  }, [editingRowId, emitRowAction, handlers, renderEditableCell, renderReadonlyCell, tableSchema])

  const filterKeys = React.useMemo(() => tableSchema.columns.map((column) => column.key), [tableSchema.columns])

  const filteredData = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return mutableData
    }

    return mutableData.filter((row) =>
      filterKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(query))
    )
  }, [filterKeys, mutableData, searchQuery])

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

  const rowSelection = table.getState().rowSelection

  React.useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
    const selectedIds = selectedRows.map((row) => toRowId(row, tableSchema))
    handlers?.onRowSelectionChange?.(selectedIds, selectedRows)
  }, [handlers, rowSelection, table, tableSchema])

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
            placeholder="Filter records..."
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
                      <DraggableRow key={row.id} row={row} rowId={toRowId(row.original, tableSchema)} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {tableSchema.emptyMessage ?? "No results."}
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
