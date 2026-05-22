import * as React from "react"
import { Plus } from "lucide-react"

import {
  EnhancedDataTable,
  type DashboardRow,
  type DashboardTableActionHandlers,
} from "@/components/composites/DataTable"
import { Button } from "@/components/primitives/Button"

export interface DataTableProps {
  rows: DashboardRow[]
  handlers?: DashboardTableActionHandlers
  onCreateClick?: () => void
  createButtonLabel?: string
}

export const DataTable = React.memo<DataTableProps>(({ rows, handlers, onCreateClick, createButtonLabel }) => {
  return (
    <section className="px-4 lg:px-6">
      <EnhancedDataTable
        data={rows}
        handlers={handlers}
        onCreateClick={onCreateClick ?? handlers?.onCreateClick ?? handlers?.onAddSection}
        createButtonLabel={createButtonLabel}
        rightActions={
          handlers?.onAddSection ? (
            <Button variant="outline" size="sm" className="h-8" onClick={handlers.onAddSection}>
              <Plus className="size-4" />
              <span className="hidden lg:inline">Add Section</span>
            </Button>
          ) : null
        }
      />
    </section>
  )
})

DataTable.displayName = "DataTable"
