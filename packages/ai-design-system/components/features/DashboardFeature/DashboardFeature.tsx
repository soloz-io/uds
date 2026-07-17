import * as React from "react"
import { EmptyState } from "@/components/composites/EmptyState"
import { DashboardChart } from "@/components/composites/DashboardChart"
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
  DashboardApp,
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
  apps?: DashboardApp[]
  currentAppId?: string
  quickCreateEntityName?: string
  quickCreateFields?: FormReportsFieldDefinition[]
  quickCreateButtonLabel?: string
  /**
   * Optional empty state configuration. When provided and rows is empty, this state is shown instead of the table.
   */
  emptyState?: {
    title: string
    description: string
    actionLabel: string
  }
  /** Controlled state for external creation drawer open */
  createDrawerOpen?: boolean
  onOpenCreateDrawerChange?: (open: boolean) => void
  /**
   * Additional CSS classes
   */
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
    quickCreateEntityName = "App",
    quickCreateFields,
    quickCreateButtonLabel = "Quick Create",
    emptyState,
    createDrawerOpen: externalDrawerOpen,
    onOpenCreateDrawerChange: externalOnDrawerOpenChange,
    className,
  }) => {
    const [internalDrawerOpen, setInternalDrawerOpen] = React.useState(false)
    const drawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : internalDrawerOpen
    const setDrawerOpen = externalOnDrawerOpenChange || setInternalDrawerOpen
    
    const [drawerMode, setDrawerMode] = React.useState<'table' | 'quick-create' | null>(null)
    
    const activeFields = drawerMode === 'quick-create' && quickCreateFields ? quickCreateFields : createFields
    const activeEntityName = drawerMode === 'quick-create' ? quickCreateEntityName : createEntityName
    const activeButtonLabel = drawerMode === 'quick-create' ? quickCreateButtonLabel : createButtonLabel

    const [values, setValues] = React.useState<FormReportsValues>(() => buildInitialValues(activeFields))

    React.useEffect(() => {
      setValues(buildInitialValues(activeFields))
    }, [activeFields])

    const openCreateDrawer = React.useCallback(() => {
      actionHandlers?.table?.onCreateClick?.()
      setDrawerMode('table')
      setDrawerOpen(true)
      actionHandlers?.onCreateDrawerOpenChange?.(true)
    }, [actionHandlers, setDrawerOpen])

    const openQuickCreateDrawer = React.useCallback(() => {
      setDrawerMode('quick-create')
      setDrawerOpen(true)
      actionHandlers?.onCreateDrawerOpenChange?.(true)
    }, [actionHandlers, setDrawerOpen])

    const handleDrawerOpenChange = React.useCallback(
      (open: boolean) => {
        setDrawerOpen(open)
        if (!open) {
          setTimeout(() => setDrawerMode(null), 300)
        }
        actionHandlers?.onCreateDrawerOpenChange?.(open)
      },
      [actionHandlers, setDrawerOpen]
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
        if (drawerMode === 'quick-create') {
          await Promise.resolve(actionHandlers?.onQuickCreateSubmit?.(nextValues))
        } else {
          await Promise.resolve(actionHandlers?.onCreateSubmit?.(nextValues))
        }
        setDrawerOpen(false)
        setTimeout(() => setDrawerMode(null), 300)
        actionHandlers?.onCreateDrawerOpenChange?.(false)
        setValues(buildInitialValues(createFields))
      },
      [actionHandlers, createFields, drawerMode, setDrawerOpen]
    )

    return (
      <div className={`flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 ${className ?? ""}`}>
        {rows.length === 0 && emptyState ? (
          <div className="flex flex-1 items-center justify-center min-h-[500px]">
            <EmptyState
              title={emptyState.title}
              description={emptyState.description}
              actionLabel={emptyState.actionLabel}
              onAction={quickCreateFields ? openQuickCreateDrawer : openCreateDrawer}
            />
          </div>
        ) : (
          <>
            {rows.length > 0 && (
              <>
                <DashboardMetrics items={kpis} />
                <DashboardChart
                  series={visitorsSeries}
                  onTimeRangeChange={actionHandlers?.onChartTimeRangeChange}
                  title="Total Visitors"
                  description="Total for the last 3 months"
                  shortDescription="Last 3 months"
                  timeRanges={[
                    { value: "90d", label: "Last 3 months" },
                    { value: "30d", label: "Last 30 days" },
                    { value: "7d", label: "Last 7 days" }
                  ]}
                  desktopLabel="Desktop"
                  mobileLabel="Mobile"
                  showMobile={true}
                />
              </>
            )}
            <DataTable
              rows={rows}
              tableSchema={tableSchema}
              handlers={actionHandlers?.table}
              onCreateClick={openCreateDrawer}
              createButtonLabel={createButtonLabel}
            />
          </>
        )}

        <FormReportsDrawerForm
          open={drawerOpen}
          onOpenChange={handleDrawerOpenChange}
          title={`Create ${activeEntityName}`}
          description={`Enter the details for your new ${activeEntityName.toLowerCase()}.`}
          fields={activeFields}
          values={values}
          submitLabel={activeButtonLabel}
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


