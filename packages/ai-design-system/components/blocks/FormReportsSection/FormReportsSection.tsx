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
        />
      </section>
    )
  }
)

FormReportsSection.displayName = "FormReportsSection"
