import * as React from "react"

import {
  FormReportsDrawerForm,
  type DashboardPaginationState,
  type FormReportsColumn,
  type FormReportsEntity,
  type FormReportsFieldDefinition,
  type FormReportsRowAction,
  type FormReportsValue,
  type FormReportsValues,
} from "@/components/composites/FormReports"
import { FormReportsSection } from "@/components/blocks/FormReportsSection"

import type { FormReportsFeatureActionHandlers } from "./useFormReportsFeature.d"

export interface FormReportsFeatureProps {
  entityName: string
  fields: FormReportsFieldDefinition[]
  columns: FormReportsColumn[]
  items: FormReportsEntity[]
  pagination?: DashboardPaginationState
  rowActions?: FormReportsRowAction[]
  actionHandlers?: FormReportsFeatureActionHandlers
  createButtonLabel?: string
  showCreateButton?: boolean
  enableCreateDrawer?: boolean
  className?: string
}

function buildInitialValues(fields: FormReportsFieldDefinition[]): FormReportsValues {
  return fields.reduce<FormReportsValues>((acc, field) => {
    acc[field.name] = field.defaultValue ?? (field.type === "boolean" ? false : "")
    return acc
  }, {})
}

export const FormReportsFeature = React.memo<FormReportsFeatureProps>(
  ({
    entityName,
    fields,
    columns,
    items,
    pagination,
    rowActions,
    actionHandlers,
    createButtonLabel = "Create",
    showCreateButton = true,
    enableCreateDrawer = true,
    className,
  }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [values, setValues] = React.useState<FormReportsValues>(() => buildInitialValues(fields))

    React.useEffect(() => {
      setValues(buildInitialValues(fields))
    }, [fields])

    const openDrawer = React.useCallback(
      (source: "create") => {
        actionHandlers?.onCreateClick?.(source)
        if (!enableCreateDrawer) {
          return
        }
        setDrawerOpen(true)
        actionHandlers?.onDrawerOpenChange?.(true)
      },
      [actionHandlers, enableCreateDrawer]
    )

    const handleOpenChange = React.useCallback(
      (open: boolean) => {
        setDrawerOpen(open)
        actionHandlers?.onDrawerOpenChange?.(open)
      },
      [actionHandlers]
    )

    const handleFieldChange = React.useCallback(
      (name: string, value: FormReportsValue, nextValues: FormReportsValues) => {
        setValues(nextValues)
        actionHandlers?.onFieldChange?.(name, value, nextValues)
      },
      [actionHandlers]
    )

    const handleFieldBlur = React.useCallback(
      (name: string, value: FormReportsValue, nextValues: FormReportsValues) => {
        actionHandlers?.onFieldBlur?.(name, value, nextValues)
      },
      [actionHandlers]
    )

    const handleSubmit = React.useCallback(
      async (nextValues: FormReportsValues) => {
        await Promise.resolve(actionHandlers?.onSubmit?.(nextValues))
        setDrawerOpen(false)
        actionHandlers?.onDrawerOpenChange?.(false)
        setValues(buildInitialValues(fields))
      },
      [actionHandlers, fields]
    )

    return (
      <div className={`flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 ${className ?? ""}`}>
        <FormReportsSection
          onCreateClick={showCreateButton ? () => openDrawer("create") : undefined}
          createButtonLabel={createButtonLabel}
          items={items}
          columns={columns}
          pagination={pagination}
          rowActions={rowActions}
          tableHandlers={actionHandlers?.table}
        />

        {enableCreateDrawer ? (
          <FormReportsDrawerForm
            open={drawerOpen}
            onOpenChange={handleOpenChange}
            title={`Create ${entityName}`}
            description={`Enter the details for your new ${entityName.toLowerCase()}.`}
            fields={fields}
            values={values}
            submitLabel={createButtonLabel}
            onFieldChange={handleFieldChange}
            onFieldBlur={handleFieldBlur}
            onSubmit={handleSubmit}
            onCancel={actionHandlers?.onCancel}
          />
        ) : null}
      </div>
    )
  }
)

FormReportsFeature.displayName = "FormReportsFeature"
