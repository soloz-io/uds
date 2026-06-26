import { useState, useCallback, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import type { UsePageLayoutReturn } from './usePageLayout.d'

/**
 * Mock implementation of usePageLayout hook for Storybook stories
 */
export const usePageLayoutMock = (): UsePageLayoutReturn => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('agent')
  const [isLoading, setIsLoading] = useState(false)
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }
  }, [])

  const handleTabChange = useCallback((value: string) => {
    console.log('🔄 State Management - Tab switched to:', value)
    setActiveTab(value)
    setIsLoading(true)

    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current)
    }

    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 900)
  }, [])

  return {
    isSidebarOpen,
    activeTab,
    isLoading,
    loadingMessage: `Loading ${activeTab} view...`,
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

export function usePageLayoutStoryActionsMock() {
  const [isChatOpen, setIsChatOpen] = useState(true)

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev)
    console.log('🔄 State Management - Chat toggled')
  }, [])

  const onVersionSelect = useCallback((id: string) => {
    console.log('🔄 State Management - Selected version:', id)
  }, [])

  const onSave = useCallback(() => {
    console.log('🔄 State Management - Workflow saved')
  }, [])

  const onUndo = useCallback(() => {
    console.log('🔄 State Management - Undo')
  }, [])

  const onRedo = useCallback(() => {
    console.log('🔄 State Management - Redo')
  }, [])

  const onSubmit = useCallback((message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
    console.log('🔄 State Management - Refinement request:', message)
  }, [])

  const onApprove = useCallback(() => {
    console.log('🔄 State Management - Changes approved')
  }, [])

  const onReject = useCallback(() => {
    console.log('🔄 State Management - Changes rejected')
  }, [])

  return {
    isChatOpen,
    toggleChat,
    onVersionSelect,
    onSave,
    onUndo,
    onRedo,
    onSubmit,
    onApprove,
    onReject,
  }
}
