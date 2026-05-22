import { useCallback, useState } from "react"
import type { DashboardRow } from "@/components/composites/DataTable"

import {
  dashboardKpis,
  dashboardRows,
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
    kpis: dashboardKpis,
    visitorsSeries,
  }
}
