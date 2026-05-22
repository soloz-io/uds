import * as React from "react"
import { SidebarInset } from "@/components/primitives/Sidebar"

/**
 * PageContainer Composite
 *
 * Container for page content that works with Sidebar layout.
 * Wraps content with SidebarInset primitive.
 */

export interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export const PageContainer = React.memo<PageContainerProps>(({ children, className }) => {
  return (
    <SidebarInset className={className}>
      {children}
    </SidebarInset>
  )
})

PageContainer.displayName = "PageContainer"
