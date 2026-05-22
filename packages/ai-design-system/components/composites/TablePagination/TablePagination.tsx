import * as React from "react"
import { Button } from "@/components/primitives/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select"
import { Label } from "@/components/primitives/Label"
import type { Table } from "@tanstack/react-table"

/**
 * TablePagination Composite
 *
 * Reusable pagination controls for tables with TanStack Table integration.
 * Composes Button, Select, and Label primitives.
 *
 * @example
 * ```tsx
 * <TablePagination table={table} />
 * ```
 */

export interface TablePaginationProps {
  /**
   * TanStack Table instance
   */
  table: Table<unknown>
  /**
   * Available page size options
   */
  pageSizeOptions?: number[]
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * TablePagination component
 *
 * Provides pagination controls including page size selection and navigation buttons.
 */
export const TablePagination = React.memo<TablePaginationProps>(
  ({ table, pageSizeOptions = [10, 20, 30, 40, 50], className }) => {
    return (
      <div className={`flex items-center justify-between px-4 py-2 ${className || ""}`}>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger id="rows-per-page" className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

TablePagination.displayName = "TablePagination"
