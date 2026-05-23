import { useCallback, useState } from "react"
import type { DashboardRow } from "@/components/composites/DataTable"
import type { FormReportsValues } from "@/components/composites/FormReports"

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

  const [rows, setRows] = useState<DashboardRow[]>(getInitialRows)

  return {
    rows,
    tableSchema: dashboardTableSchema,
    kpis: dashboardKpis,
    visitorsSeries,
    createFields: dashboardCreateFields,
    actionHandlers: {
      onCreateSubmit: (values: FormReportsValues) => {
        setRows((prev) => {
          const nextId = prev.reduce((max, row) => Math.max(max, Number(row.id)), 0) + 1
          const nextRow: DashboardRow = {
            id: nextId,
            header: String(values.slug || `section-${nextId}`),
            type: String(values.type || "narrative"),
            status: values.enabled ? "Done" : "Not Started",
            target: "0",
            limit: "0",
            reviewer: "Assign reviewer",
          }
          return [nextRow, ...prev]
        })
      },
      table: {
        onDeleteRow: (row) => {
          setRows((prev) => prev.filter((item) => String(item.id) !== String(row.id)))
        },
        onCopyRow: (row) => {
          setRows((prev) => {
            const nextId = prev.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1
            return [{ ...row, id: nextId, header: `${String(row.header ?? "Section")} Copy` }, ...prev]
          })
        },
      },
    },
  }
}
