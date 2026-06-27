import * as React from "react"

import type { FormReportsFieldDefinition, FormReportsValue, FormReportsValues } from "./FormReportsDrawerForm"
import { FormReportsDrawerForm } from "./FormReportsDrawerForm"
import type { DashboardPaginationState, FormReportsColumn, FormReportsEntity, FormReportsRowAction, FormReportsTableHandlers } from "./FormReportsTable"
import { FormReportsTable } from "./FormReportsTable"

export interface FormReportsProps {
  items: FormReportsEntity[]
  columns: FormReportsColumn[]
  fields?: FormReportsFieldDefinition[]
  rowActions?: FormReportsRowAction[]
  pagination?: DashboardPaginationState
  handlers?: FormReportsTableHandlers
  leftActions?: React.ReactNode
  rightActions?: React.ReactNode
  drawerTitle?: string
  drawerDescription?: string
  submitLabel?: string
  cancelLabel?: string
  createButtonLabel?: string
  onCreateSubmit?: (values: FormReportsValues) => void
}

export const FormReports = React.memo<FormReportsProps>(
  ({
    items,
    columns,
    fields,
    rowActions,
    pagination,
    handlers,
    leftActions,
    rightActions,
    drawerTitle = "New Item",
    drawerDescription,
    submitLabel = "Create",
    cancelLabel = "Cancel",
    createButtonLabel = "Create",
    onCreateSubmit,
  }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [formValues, setFormValues] = React.useState<FormReportsValues>({})

    const handleOpenChange = React.useCallback((open: boolean) => {
      setDrawerOpen(open)
      if (!open) {
        setFormValues({})
      }
    }, [])

    const handleFieldChange = React.useCallback(
      (_name: string, _value: FormReportsValue, nextValues: FormReportsValues) => {
        setFormValues(nextValues)
      },
      []
    )

    const handleCreateClick = React.useCallback(() => {
      const defaults: FormReportsValues = {}
      if (fields) {
        for (const field of fields) {
          if (field.defaultValue !== undefined) {
            defaults[field.name] = field.defaultValue
          }
        }
      }
      setFormValues(defaults)
      setDrawerOpen(true)
    }, [fields])

    const handleSubmit = React.useCallback(
      (values: FormReportsValues) => {
        onCreateSubmit?.(values)
        setDrawerOpen(false)
        setFormValues({})
      },
      [onCreateSubmit]
    )

    return (
      <>
        <FormReportsTable
          items={items}
          columns={columns}
          rowActions={rowActions}
          pagination={pagination}
          handlers={handlers}
          leftActions={leftActions}
          rightActions={rightActions}
          onCreateClick={handleCreateClick}
          createButtonLabel={createButtonLabel}
        />
        {fields ? (
          <FormReportsDrawerForm
            open={drawerOpen}
            onOpenChange={handleOpenChange}
            title={drawerTitle}
            description={drawerDescription}
            fields={fields}
            values={formValues}
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
          />
        ) : null}
      </>
    )
  }
)

FormReports.displayName = "FormReports"
