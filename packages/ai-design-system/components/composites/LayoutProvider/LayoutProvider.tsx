import * as React from "react"
import { SidebarProvider } from "@/components/primitives/Sidebar"

/**
 * LayoutProvider Block
 *
 * Wraps SidebarProvider primitive for use in feature layer.
 * Provides sidebar state management and CSS variables.
 */

export interface LayoutProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  sidebarWidth?: string
  sidebarWidthIcon?: string
}

export const LayoutProvider = React.memo<LayoutProviderProps>(
  ({ children, defaultOpen = true, sidebarWidth = "var(--spacing-sidebar-width)", sidebarWidthIcon = "var(--spacing-sidebar-width-icon)" }) => {
    return (
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={{
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-icon": sidebarWidthIcon,
        } as React.CSSProperties}
      >
        {children}
      </SidebarProvider>
    )
  }
)

LayoutProvider.displayName = "LayoutProvider"
