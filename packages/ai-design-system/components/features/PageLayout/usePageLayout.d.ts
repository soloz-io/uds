/**
 * Hook contract for PageLayout feature
 * Manages sidebar state and layout configuration
 *
 * @example
 * ```tsx
 * const { isSidebarOpen, activeTab, toggleSidebar, onTabChange, layoutConfig } = usePageLayout()
 * ```
 */
export interface UsePageLayoutReturn {
  /** Whether the sidebar is currently open */
  isSidebarOpen: boolean
  /** Currently active tab value */
  activeTab: string
  /** Toggle sidebar open/closed */
  toggleSidebar: () => void
  /** Set sidebar open state */
  setSidebarOpen: (open: boolean) => void
  /** Handle tab change */
  onTabChange: (value: string) => void
  /** Current layout configuration */
  layoutConfig: {
    sidebarWidth: string
    headerHeight: string
  }
}

export type UsePageLayout = () => UsePageLayoutReturn

export function usePageLayout(): UsePageLayoutReturn;
