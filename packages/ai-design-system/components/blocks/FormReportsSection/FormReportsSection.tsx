import * as React from "react"
import {
  FormReportsTable,
  type FormReportsColumn,
  type FormReportsEntity,
  type FormReportsRowAction,
  type FormReportsTableHandlers,
  type DashboardPaginationState,
} from "@/components/composites/FormReports"

export interface FormReportsSectionProps {
  onCreateClick?: () => void
  createButtonLabel?: string
  items: FormReportsEntity[]
  columns: FormReportsColumn[]
  rowActions?: FormReportsRowAction[]
  pagination?: DashboardPaginationState
  tableHandlers?: FormReportsTableHandlers
  tableLeftActions?: React.ReactNode
  enableRowSelection?: boolean
}

export const FormReportsSection = React.memo<FormReportsSectionProps>(
  ({
    onCreateClick,
    createButtonLabel = "Create",
    items,
    columns,
    rowActions,
    pagination,
    tableHandlers,
    tableLeftActions,
    enableRowSelection,
  }) => {
    return (
      <section>
        <FormReportsTable
          items={items}
          columns={columns}
          rowActions={rowActions}
          pagination={pagination}
          handlers={tableHandlers}
          leftActions={tableLeftActions}
          onCreateClick={onCreateClick}
          createButtonLabel={createButtonLabel}
          enableRowSelection={enableRowSelection}
        />
      </section>
    )
  }
)

FormReportsSection.displayName = "FormReportsSection"
