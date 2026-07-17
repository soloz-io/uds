import type { DashboardRow } from "@/components/composites/DataTable"
import type {
  DashboardTableActionHandlers,
} from "@/components/composites/DataTable"
import type { DynamicTableSchema } from "ui-schema-contracts"
import type {
  FormReportsFieldDefinition,
  FormReportsValue,
  FormReportsValues,
} from "@/components/composites/FormReports"

export interface DashboardKpi {
  title: string
  value: string | number
  trend?: {
    direction: "up" | "down"
    value: string
  }
  footer?: {
    message: string
    description: string
  }
}

export interface DashboardSeriesPoint {
  date: string
  desktop: number
  mobile: number
}

export type DashboardChartTimeRange = string

export interface DashboardApp {
  id: string
  name: string
}

/**
 * Consumer callbacks for DashboardFeature interactions.
 * Use this contract to wire feature UI actions to app-specific logic.
 */
export interface DashboardFeatureActionHandlers {
  /** Called whenever the chart time range changes. */
  onChartTimeRangeChange?: (range: DashboardChartTimeRange) => void
  /** Table action callbacks for all interactive table controls. */
  table?: DashboardTableActionHandlers
  /** Called when the dashboard create drawer opens or closes. */
  onCreateDrawerOpenChange?: (open: boolean) => void
  /** Called on create drawer field change. */
  onCreateFieldChange?: (name: string, value: FormReportsValue, values: FormReportsValues) => void
  /** Called on create drawer field blur. */
  onCreateFieldBlur?: (name: string, value: FormReportsValue, values: FormReportsValues) => void
  /** Called when create drawer form is submitted. */
  onCreateSubmit?: (values: FormReportsValues) => void | Promise<void>
  /** Called when quick create drawer form is submitted. */
  onQuickCreateSubmit?: (values: FormReportsValues) => void | Promise<void>
  /** Called when create drawer cancel is clicked. */
  onCreateCancel?: () => void
  /** Called when a different app is selected in the app switcher. */
  onAppChange?: (appId: string) => void
}

export interface UseDashboardFeatureReturn {
  rows: DashboardRow[]
  tableSchema: DynamicTableSchema
  kpis: DashboardKpi[]
  visitorsSeries: DashboardSeriesPoint[]
  createEntityName?: string
  createFields: FormReportsFieldDefinition[]
  createButtonLabel?: string
  apps?: DashboardApp[]
  currentAppId?: string
  quickCreateEntityName?: string
  quickCreateFields?: FormReportsFieldDefinition[]
  quickCreateButtonLabel?: string
  actionHandlers?: DashboardFeatureActionHandlers
  emptyState?: {
    title: string
    description: string
    actionLabel: string
  }
  createDrawerOpen?: boolean
  onOpenCreateDrawerChange?: (open: boolean) => void
}

export function useDashboardFeature(): UseDashboardFeatureReturn
