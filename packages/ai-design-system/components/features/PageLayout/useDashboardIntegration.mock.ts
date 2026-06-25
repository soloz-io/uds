import { useState, useCallback, useMemo } from 'react'
import type { Project } from '@/components/composites/ProjectSwitcher'
import {
  dashboardKpis,
  dashboardRows,
  dashboardTableSchema,
  visitorsSeries,
} from '@/components/features/DashboardFeature/DashboardFeature.mocks'
import type { FormReportsValues } from '@/components/composites/FormReports'

export function useDashboardIntegrationMock() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [dashboardDataMap, setDashboardDataMap] = useState<Record<string, any>>({})

  const handleSelectProject = useCallback((id: string) => {
    setSelectedProjectId(id)
    setActiveTab("dashboard") // reload dashboard data (simulated by switching to dashboard tab)
  }, [])

  const handleCreateSubmit = useCallback(async (values: FormReportsValues) => {
    console.log("[Mock] Creating app with values:", values)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newId = `app-${Date.now()}`
    const newApp: Project = {
      id: newId,
      name: String(values.name || `App ${projects.length + 1}`)
    }
    
    // Generate some fake specific rows for this new project so it looks like it reloaded
    const startIndex = (projects.length * 3) % dashboardRows.length
    const projectRows = dashboardRows.slice(startIndex, startIndex + 3).map(r => ({
      ...r,
      id: `${newId}-${r.id}`,
      header: `${r.header} (${newApp.name})`
    }))

    setProjects(prev => [...prev, newApp])
    setDashboardDataMap(prev => ({
      ...prev,
      [newId]: projectRows
    }))
    
    // Automatically select the new project and switch to dashboard
    setSelectedProjectId(newId)
    setActiveTab("dashboard")
    setIsCreateDrawerOpen(false)
  }, [projects.length])

  const handleDeleteRow = useCallback((row: any) => {
    if (!selectedProjectId) return
    console.log("[Mock] Delete row:", row.id)
    setDashboardDataMap(prev => {
      const rows = prev[selectedProjectId] || []
      return {
        ...prev,
        [selectedProjectId]: rows.filter((r: any) => String(r.id) !== String(row.id))
      }
    })
  }, [selectedProjectId])

  const currentRows = selectedProjectId ? (dashboardDataMap[selectedProjectId] || []) : []

  const handleCreateProjectClick = useCallback(() => {
    setIsCreateDrawerOpen(true)
  }, [])

  return {
    projects,
    selectedProjectId,
    onSelectProject: handleSelectProject,
    onCreateProjectClick: handleCreateProjectClick,
    
    activeTab,
    onTabChange: setActiveTab,
    
    isCreateDrawerOpen,
    setIsCreateDrawerOpen,
    
    dashboardProps: {
      kpis: dashboardKpis,
      visitorsSeries,
      rows: currentRows,
      tableSchema: dashboardTableSchema,
      createDrawerOpen: isCreateDrawerOpen,
      onOpenCreateDrawerChange: setIsCreateDrawerOpen,
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
        onChartTimeRangeChange: (range: any) => console.log("[Mock] Chart range changed:", range),
        onCreateSubmit: handleCreateSubmit,
        table: {
          onDeleteRow: handleDeleteRow,
        },
      },
    }
  }
}
