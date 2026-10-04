import type * as React from "react"

export interface SolutionTab {
  id: string
  label: string
  category?: string
  headline: string
  body: string
  imageSrc?: string
  imageAlt?: string
}

export interface SolutionsLayoutProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  tabs: SolutionTab[]
  defaultTabId?: string
  activeTabId?: string
  onTabChange?: (tabId: string) => void
  onPreviousTab?: () => void
  onNextTab?: () => void
  className?: string
}
