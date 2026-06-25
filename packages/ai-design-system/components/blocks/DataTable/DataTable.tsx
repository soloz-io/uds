import * as React from "react"

import {
  EnhancedDataTable,
  type DashboardRow,
  type DashboardTableActionHandlers,
} from "@/components/composites/DataTable"
import type { DynamicTableSchema } from "ui-schema-contracts"
import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"

export interface DataTableProps {
  rows: DashboardRow[]
  tableSchema: DynamicTableSchema
  handlers?: DashboardTableActionHandlers
  onCreateClick?: () => void
  createButtonLabel?: string
}

export const DataTable = React.memo<DataTableProps>(({ rows, tableSchema, handlers, onCreateClick, createButtonLabel }) => {
  return (
    <section className="px-4 lg:px-6">
      <EnhancedDataTable
        data={rows}
        tableSchema={tableSchema}
        handlers={handlers}
        onCreateClick={onCreateClick ?? handlers?.onCreateClick ?? handlers?.onAddSection}
        createButtonLabel={createButtonLabel}
        rightActions={
          handlers?.onAddSection ? (
            <Button variant="outline" size="sm" className="h-8" onClick={handlers.onAddSection}>
              <Icon name="plus" size="sm" />
              <span className="hidden lg:inline">Add Section</span>
            </Button>
          ) : null
        }
      />
    </section>
  )
})

DataTable.displayName = "DataTable"
