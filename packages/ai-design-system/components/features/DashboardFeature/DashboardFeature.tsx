import * as React from "react"

import { DashboardChart } from "@/components/blocks/DashboardChart"
import { DashboardMetrics } from "@/components/blocks/DashboardMetrics"
import { DataTable } from "@/components/blocks/DataTable"
import { type DashboardRow } from "@/components/composites/DataTable"
import {
  FormReportsDrawerForm,
  type FormReportsFieldDefinition,
  type FormReportsValue,
  type FormReportsValues,
} from "@/components/composites/FormReports"
import type { DynamicTableSchema } from "ui-schema-contracts"

import type {
  DashboardFeatureActionHandlers,
  DashboardKpi,
  DashboardSeriesPoint,
} from "./useDashboardFeature.d"

export interface DashboardFeatureProps {
  kpis: DashboardKpi[]
  rows: DashboardRow[]
  tableSchema: DynamicTableSchema
  visitorsSeries: DashboardSeriesPoint[]
  actionHandlers?: DashboardFeatureActionHandlers
  createEntityName?: string
  createFields: FormReportsFieldDefinition[]
  createButtonLabel?: string
  className?: string
}

function buildInitialValues(fields: FormReportsFieldDefinition[]): FormReportsValues {
  return fields.reduce<FormReportsValues>((acc, field) => {
    acc[field.name] = field.defaultValue ?? (field.type === "boolean" ? false : "")
    return acc
  }, {})
}

export const DashboardFeature = React.memo<DashboardFeatureProps>(
  ({
    kpis,
    rows,
    tableSchema,
    visitorsSeries,
    actionHandlers,
    createEntityName = "Section",
    createFields,
    createButtonLabel = "Create",
    className,
  }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [values, setValues] = React.useState<FormReportsValues>(() => buildInitialValues(createFields))

    React.useEffect(() => {
      setValues(buildInitialValues(createFields))
    }, [createFields])

    const openCreateDrawer = React.useCallback(() => {
      actionHandlers?.table?.onCreateClick?.()
      setDrawerOpen(true)
      actionHandlers?.onCreateDrawerOpenChange?.(true)
    }, [actionHandlers])

    const handleDrawerOpenChange = React.useCallback(
      (open: boolean) => {
        setDrawerOpen(open)
        actionHandlers?.onCreateDrawerOpenChange?.(open)
      },
      [actionHandlers]
    )

    const handleFieldChange = React.useCallback(
      (name: string, value: FormReportsValue, nextValues: FormReportsValues) => {
        setValues(nextValues)
        actionHandlers?.onCreateFieldChange?.(name, value, nextValues)
      },
      [actionHandlers]
    )

    const handleFieldBlur = React.useCallback(
      (name: string, value: FormReportsValue, nextValues: FormReportsValues) => {
        actionHandlers?.onCreateFieldBlur?.(name, value, nextValues)
      },
      [actionHandlers]
    )

    const handleCreateSubmit = React.useCallback(
      async (nextValues: FormReportsValues) => {
        await Promise.resolve(actionHandlers?.onCreateSubmit?.(nextValues))
        setDrawerOpen(false)
        actionHandlers?.onCreateDrawerOpenChange?.(false)
        setValues(buildInitialValues(createFields))
      },
      [actionHandlers, createFields]
    )

    return (
      <div className={`flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 ${className ?? ""}`}>
        <DashboardMetrics items={kpis} />
        <DashboardChart
          series={visitorsSeries}
          onTimeRangeChange={actionHandlers?.onChartTimeRangeChange}
        />
        <DataTable
          rows={rows}
          tableSchema={tableSchema}
          handlers={actionHandlers?.table}
          onCreateClick={openCreateDrawer}
          createButtonLabel={createButtonLabel}
        />

        <FormReportsDrawerForm
          open={drawerOpen}
          onOpenChange={handleDrawerOpenChange}
          title={`Create ${createEntityName}`}
          description={`Enter the details for your new ${createEntityName.toLowerCase()}.`}
          fields={createFields}
          values={values}
          submitLabel={createButtonLabel}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
          onSubmit={handleCreateSubmit}
          onCancel={actionHandlers?.onCreateCancel}
        />
      </div>
    )
  }
)

DashboardFeature.displayName = "DashboardFeature"
