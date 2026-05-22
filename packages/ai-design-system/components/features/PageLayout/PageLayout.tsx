import * as React from "react"
import { AppSidebar, type AppSidebarProps } from "@/components/blocks/AppSidebar"
import { LayoutProvider } from "@/components/blocks/LayoutProvider"
import { SectionLayout, type SectionLayoutProps, type SectionLayoutSection } from "@/components/blocks/SectionLayout"
import { AppHeader, type AppHeaderProps } from "@/components/composites/AppHeader"
import { PageContainer } from "@/components/composites/PageContainer"

/**
 * PageLayout Feature
 *
 * Complete page layout with sidebar, header, and content area.
 * Composes AppSidebar block and SectionLayout block with SidebarProvider.
 * Content area can use SectionLayout for resizable panels with headers.
 *
 * This is a self-contained feature component that handles all its own providers
 * and layout internally. No external wrapping is required.
 *
 * @example
 * ```tsx
 * <PageLayout
 *   sidebar={sidebarConfig}
 *   header={headerConfig}
 *   defaultSidebarOpen={true}
 *   layoutSections={[
 *     {
 *       id: 'panel1',
 *       content: <div>Content 1</div>,
 *       header: { tabs: [{ value: 'view', label: 'View' }] }
 *     },
 *     {
 *       id: 'panel2', 
 *       content: <div>Content 2</div>,
 *       header: { tabs: [{ value: 'edit', label: 'Edit' }] }
 *     }
 *   ]}
 *   dragHandleColor="primary"
 * >
 *   {children}
 * </PageLayout>
 * ```
 */

export interface PageLayoutProps {
  /**
   * Sidebar configuration
   */
  sidebar: AppSidebarProps
  /**
   * Header configuration
   */
  header: AppHeaderProps
  /**
   * Page content
   * Optional when layoutSections is provided
   */
  children?: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether the sidebar is open by default
   * @default true
   */
  defaultSidebarOpen?: boolean
  /**
   * Sidebar width CSS variable value
   * @default "var(--spacing-sidebar-width)"
   */
  sidebarWidth?: string
  /**
   * Sidebar icon width CSS variable value
   * @default "var(--spacing-sidebar-width-icon)"
   */
  sidebarWidthIcon?: string
  /**
   * Section layout configuration for content area
   * If provided, creates resizable panels with headers instead of single content area
   */
  layoutSections?: SectionLayoutSection[]
  /**
   * Layout orientation for section layout
   * @default "horizontal"
   */
  layoutOrientation?: "horizontal" | "vertical"
  /**
   * Storage key for layout panel sizes persistence
   */
  layoutStorageKey?: string
  /**
   * Color theme for drag handles in section layout
   * @default "border"
   */
  dragHandleColor?: "primary" | "secondary" | "accent" | "border" | "muted"
}

/**
 * PageLayout component
 *
 * Provides a complete page layout with sidebar, header, and content area.
 * Includes SidebarProvider for state management.
 */
export const PageLayout = React.memo<PageLayoutProps>(
  ({ 
    sidebar, 
    header, 
    children, 
    className,
    defaultSidebarOpen = true,
    sidebarWidth = "var(--spacing-sidebar-width)",
    sidebarWidthIcon = "var(--spacing-sidebar-width-icon)",
    layoutSections,
    layoutOrientation = "horizontal",
    layoutStorageKey,
    dragHandleColor = "border",
  }) => {
    const contentArea = layoutSections ? (
      <SectionLayout
        sections={layoutSections}
        orientation={layoutOrientation}
        storageKey={layoutStorageKey}
        dragHandleColor={dragHandleColor}
        className="flex-1 min-h-0"
      />
    ) : (
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    )

    return (
      <LayoutProvider
        defaultOpen={defaultSidebarOpen}
        sidebarWidth={sidebarWidth}
        sidebarWidthIcon={sidebarWidthIcon}
      >
        <AppSidebar {...sidebar} />
        <PageContainer className={`overflow-hidden ${className ?? ""}`}>
          <AppHeader {...header} />
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            {contentArea}
          </div>
        </PageContainer>
      </LayoutProvider>
    )
  }
)

PageLayout.displayName = "PageLayout"
