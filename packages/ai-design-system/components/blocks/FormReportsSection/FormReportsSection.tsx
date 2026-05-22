import * as React from "react"
import {
  FormReportsTable,
  type FormReportsColumn,
  type FormReportsEntity,
  type FormReportsRowAction,
  type FormReportsTableHandlers,
} from "@/components/composites/FormReports"

export interface FormReportsSectionProps {
  onCreateClick?: () => void
  createButtonLabel?: string
  items: FormReportsEntity[]
  columns: FormReportsColumn[]
  rowActions?: FormReportsRowAction[]
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
    tableHandlers,
    tableLeftActions,
  }) => {
    return (
      <section>
        <FormReportsTable
          items={items}
          columns={columns}
          rowActions={rowActions}
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
