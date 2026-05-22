import { useCallback, useState } from "react"
import type { DashboardRow } from "@/components/composites/DataTable"

import {
  dashboardCreateFields,
  dashboardKpis,
  dashboardRows,
  dashboardTableSchema,
  visitorsSeries,
} from "./DashboardFeature.mocks"
import type { UseDashboardFeatureReturn } from "./useDashboardFeature.d"

export function useDashboardFeatureMock(): UseDashboardFeatureReturn {
  const getInitialRows = useCallback<() => DashboardRow[]>(
    () => dashboardRows.map((row) => ({ ...row })),
    []
  )

  const [rows] = useState<DashboardRow[]>(getInitialRows)

  return {
    rows,
    tableSchema: dashboardTableSchema,
    kpis: dashboardKpis,
    visitorsSeries,
    createFields: dashboardCreateFields,
  }
}
