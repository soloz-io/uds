import * as React from "react"
import { Input } from "@/components/primitives/Input"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Icon } from "@/components/primitives/Icon"
import type { Table } from "@tanstack/react-table"

export interface TableToolbarProps {
  table: Table<unknown>
  searchPlaceholder?: string
  searchColumn?: string
  actions?: React.ReactNode
  className?: string
}

export const TableToolbar = React.memo<TableToolbarProps>(
  ({ table, searchPlaceholder = "Search...", searchColumn, actions, className }) => {
    return (
      <div className={`flex items-center justify-between px-4 py-2 ${className || ""}`}>
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={(searchColumn && (table.getColumn(searchColumn)?.getFilterValue() as string)) ?? ""}
            onChange={(e) => searchColumn && table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Icon name="settings-2" className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {actions}
        </div>
      </div>
    )
  }
)

TableToolbar.displayName = "TableToolbar"
