import * as React from "react"
import { AppSidebar, type AppSidebarProps } from "@/components/blocks/AppSidebar"
import { LayoutProvider } from "@/components/composites/LayoutProvider"
import { SectionLayout } from "@/components/blocks/SectionLayout/SectionLayout"
import type { SectionLayoutSection } from "@/components/blocks/SectionLayout/interfaces"
import { AppHeader, type AppHeaderProps } from "@/components/composites/AppHeader"
import { LoadingShimmer } from "@/components/composites/LoadingShimmer"
import { PageContainer } from "@/components/composites/PageContainer"

function PageLayoutLoadingState({ message }: { message: string }) {
  return <LoadingShimmer message={message} />
}

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

import { EmptyState } from "@/components/composites/EmptyState"

export interface PageLayoutEmptyState {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
}

export interface PageLayoutProps {
  /**
   * Sidebar configuration
   * Optional for apps that need header + content layout without a sidebar.
   */
  sidebar?: AppSidebarProps
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
   * Whether the page content should render a built-in loading state.
   */
  isLoading?: boolean
  /**
   * Optional loading message shown inside the built-in shimmer state.
   * @default "Loading..."
   */
  loadingMessage?: string
  /**
   * Optional custom shimmer/loading UI provided by the consumer.
   * When omitted, PageLayout renders its built-in default shimmer state.
   */
  loadingShimmer?: React.ReactNode
  /**
   * Custom loading fallback. When provided, this replaces the built-in shimmer layout.
   */
  loadingFallback?: React.ReactNode
  /**
   * Whether the page content is in an empty state
   */
  isEmpty?: boolean
  /**
   * Configuration for the built-in empty state
   */
  emptyState?: PageLayoutEmptyState
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
    isLoading = false,
    loadingMessage = "Loading...",
    loadingShimmer,
    loadingFallback,
    isEmpty = false,
    emptyState,
    className,
    defaultSidebarOpen = true,
    sidebarWidth = "var(--spacing-sidebar-width)",
    sidebarWidthIcon = "var(--spacing-sidebar-width-icon)",
    layoutSections,
    layoutOrientation = "horizontal",
    layoutStorageKey,
    dragHandleColor = "border",
  }) => {
    const contentArea = isLoading
      ? (loadingShimmer ?? loadingFallback ?? <PageLayoutLoadingState message={loadingMessage} />)
      : isEmpty && emptyState
      ? (
          <div className="flex h-full items-center justify-center p-8">
            <EmptyState
              title={emptyState.title}
              description={emptyState.description}
              actionLabel={emptyState.actionLabel}
              onAction={emptyState.onAction}
            />
          </div>
        )
      : layoutSections ? (
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

    const pageContainer = (
      <PageContainer className={`overflow-hidden ${className ?? ""}`}>
        <AppHeader {...header} />
        <div className={`min-h-0 flex-1 flex flex-col overflow-x-hidden ${layoutSections || isEmpty ? "overflow-hidden" : "overflow-y-auto"}`}>
          {contentArea}
        </div>
      </PageContainer>
    )

    return (
      <LayoutProvider
        defaultOpen={defaultSidebarOpen}
        sidebarWidth={sidebarWidth}
        sidebarWidthIcon={sidebarWidthIcon}
      >
        {sidebar ? <AppSidebar {...sidebar} /> : null}
        {pageContainer}
      </LayoutProvider>
    )
  }
)

PageLayout.displayName = "PageLayout"
