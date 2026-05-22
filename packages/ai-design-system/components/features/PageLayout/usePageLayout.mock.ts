import { useState, useCallback } from 'react'
import type { UsePageLayoutReturn } from './usePageLayout.d'

/**
 * Mock implementation of usePageLayout hook for Storybook stories
 */
export const usePageLayoutMock = (): UsePageLayoutReturn => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('agent')

  const handleTabChange = useCallback((value: string) => {
    console.log('🔄 State Management - Tab switched to:', value)
    setActiveTab(value)
  }, [])

  return {
    isSidebarOpen,
    activeTab,
    toggleSidebar: () => {
      const newState = !isSidebarOpen
      console.log('🔄 State Management - Sidebar toggled to:', newState)
      setIsSidebarOpen(newState)
    },
    setSidebarOpen: (open: boolean) => {
      console.log('🔄 State Management - Sidebar set to:', open)
      setIsSidebarOpen(open)
    },
    onTabChange: handleTabChange,
    layoutConfig: {
      sidebarWidth: 'var(--spacing-sidebar-width-mobile)',
      headerHeight: 'var(--spacing-header-height)',
    },
  }
}
