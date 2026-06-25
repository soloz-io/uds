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

export const useDashboardFeatureMock = (): UseDashboardFeatureReturn => {
  const [rows, setRows] = useState<DashboardRow[]>([])

  const handleCreateSubmit = async (values: FormReportsValues) => {
    const nextId = rows.reduce((max, row) => Math.max(max, Number(row.id)), 0) + 1
    const payload = {
      name: values.name || `App ${nextId}`,
      description: values.description || "",
      tenant_id: "mock-tenant-id",
    }
    console.log("[Mock] Create submitted with simulated BFF payload:", payload)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setRows(prev => {
      const newRow: DashboardRow = {
        id: nextId,
        header: payload.name,
        type: "App",
        status: "Active",
        target: "0",
        limit: "0",
        reviewer: "Unassigned",
      }
      return [newRow, ...prev]
    })
  }

  return {
    kpis: dashboardKpis,
    rows,
    tableSchema: dashboardTableSchema,
    visitorsSeries,
    createFields: [
      { name: "name", label: "App Name", type: "text", required: true },
      { name: "description", label: "Description", type: "text" },
    ],
    emptyState: {
      title: "Create your first App",
      description: "Get started by creating a new app to build workflows and manage tasks.",
      actionLabel: "Create App",
    },
    actionHandlers: {
      onChartTimeRangeChange: (range) => console.log("[Mock] Chart range changed:", range),
      onCreateSubmit: handleCreateSubmit,
      table: {
        onDeleteRow: (row) => {
          console.log("[Mock] Delete:", row.id)
          setRows(prev => prev.filter(r => String(r.id) !== String(row.id)))
        },
      },
    },
  }
}
