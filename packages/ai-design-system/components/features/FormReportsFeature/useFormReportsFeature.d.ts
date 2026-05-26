import type {
  DashboardPaginationState,
  FormReportsColumn,
  FormReportsEntity,
  FormReportsFieldDefinition,
  FormReportsRowAction,
  FormReportsTableHandlers,
  FormReportsValue,
  FormReportsValues,
} from "@/components/composites/FormReports"

export interface FormReportsFeatureActionHandlers {
  onCreateClick?: (source: "create") => void
  onDrawerOpenChange?: (open: boolean) => void
  onFieldChange?: (name: string, value: FormReportsValue, values: FormReportsValues) => void
  onFieldBlur?: (name: string, value: FormReportsValue, values: FormReportsValues) => void
  onSubmit?: (values: FormReportsValues) => void | Promise<void>
  onCancel?: () => void
  table?: FormReportsTableHandlers
}

export interface UseFormReportsFeatureReturn {
  entityName: string
  fields: FormReportsFieldDefinition[]
  columns: FormReportsColumn[]
  rowActions?: FormReportsRowAction[]
  items: FormReportsEntity[]
  pagination?: DashboardPaginationState
  actionHandlers?: FormReportsFeatureActionHandlers
  createButtonLabel?: string
}

export function useFormReportsFeature(): UseFormReportsFeatureReturn
