/**
 * DocumentTabBar Composite
 * 
 * VS Code-style tab bar for multi-document editors.
 * Displays open documents as closeable tabs with dirty indicators.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, Button, ScrollArea } from '@/components/primitives'
import { Icon } from '@/components/primitives/Icon'
import { cn } from '@/lib/utils'

export interface DocumentFile {
  id: string
  name: string
  isDirty?: boolean
  format?: string
  lastModified?: number
  icon?: string
  canClose?: boolean
}

/**
 * Props for DocumentTabBar composite
 */
export interface DocumentTabBarProps {
  /**
   * Array of open documents
   */
  tabs: DocumentFile[]

  /**
   * ID of currently active document
   */
  activeTabId?: string

  /**
   * Callback when tab is selected
   */
  onTabSelect?: (documentId: string) => void

  /**
   * Callback when tab close button is clicked
   */
  onTabClose?: (documentId: string) => void

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Callback to open/toggle the file explorer (e.g. mobile drawer)
   */
  onToggleExplorer?: () => void

  /**
   * Whether to show navigation scroll arrows when tabs overflow
   * @default true
   */
  showScrollArrows?: boolean

  /**
   * Callback when new tab (+) button is clicked
   */
  onNewTab?: () => void
}

/**
 * DocumentTabBar - VS Code-style document tabs
 * 
 * Renders a horizontal tab bar for switching between open documents.
 * Each tab shows:
 * - Document name
 * - Dirty indicator (when isDirty=true)
 * - Close button (X)
 * 
 * Features:
 * - Scrollable when tabs overflow horizontally with multi-device support
 * - Mouse wheel vertical-to-horizontal scroll translation
 * - Auto-scroll active tab into view
 * - Overflow indicators (edge gradients & navigation chevrons)
 * - Accessible tab navigation via Radix UI Tabs
 * - Close button to remove tabs
 * - Dirty state indicator
 */
export const DocumentTabBar = React.memo<DocumentTabBarProps>(
  ({
    tabs,
    activeTabId,
    onTabSelect,
    onTabClose,
    onToggleExplorer,
    className,
    showScrollArrows = true,
    onNewTab,
  }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const getViewport = useCallback((): HTMLElement | null => {
      return (
        scrollContainerRef.current?.querySelector<HTMLElement>(
          '[data-slot="scroll-area-viewport"]'
        ) ?? null
      )
    }, [])

    const updateScrollState = useCallback(() => {
      const viewport = getViewport()
      if (!viewport) return
      const { scrollLeft, scrollWidth, clientWidth } = viewport
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
    }, [getViewport])

    useEffect(() => {
      const viewport = getViewport()
      if (!viewport) return

      updateScrollState()
      viewport.addEventListener('scroll', updateScrollState, { passive: true })

      const resizeObserver = new ResizeObserver(() => {
        updateScrollState()
      })
      resizeObserver.observe(viewport)

      return () => {
        viewport.removeEventListener('scroll', updateScrollState)
        resizeObserver.disconnect()
      }
    }, [getViewport, updateScrollState, tabs])

    // Convert mouse wheel vertical scroll to horizontal scroll
    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        if (e.deltaY === 0) return
        const viewport = getViewport()
        if (viewport) {
          viewport.scrollLeft += e.deltaY
        }
      },
      [getViewport]
    )

    // Auto-scroll active tab into view
    useEffect(() => {
      if (!activeTabId || !scrollContainerRef.current) return
      const activeEl = scrollContainerRef.current.querySelector<HTMLElement>(
        '[data-state="active"]'
      )
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }, [activeTabId, tabs])

    const handleScrollLeft = useCallback(() => {
      const viewport = getViewport()
      if (viewport) {
        viewport.scrollBy({ left: -200, behavior: 'smooth' })
      }
    }, [getViewport])

    const handleScrollRight = useCallback(() => {
      const viewport = getViewport()
      if (viewport) {
        viewport.scrollBy({ left: 200, behavior: 'smooth' })
      }
    }, [getViewport])

    if (tabs.length === 0 && !onToggleExplorer) {
      return null
    }

    return (
      <div
        className={cn(
          'flex items-center border-b border-border bg-background relative',
          className
        )}
        data-slot="document-tab-bar"
      >
        {onToggleExplorer && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleExplorer}
            className="h-10 w-10 shrink-0 rounded-none border-r border-border/50 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle file explorer"
          >
            <Icon name="folder" size="xs" />
          </Button>
        )}

        {tabs.length > 0 && (
          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            className="flex-1 min-w-0 flex items-center relative"
          >
            {showScrollArrows && canScrollLeft && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleScrollLeft}
                className="h-10 w-7 shrink-0 rounded-none border-r border-border/50 text-muted-foreground hover:text-foreground transition-colors z-10"
                aria-label="Scroll tabs left"
              >
                <Icon name="chevron-left" size="xs" />
              </Button>
            )}

            <div className="flex-1 min-w-0 relative h-10">
              {canScrollLeft && (
                <div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-background to-transparent z-10"
                  aria-hidden="true"
                />
              )}

              <ScrollArea orientation="horizontal" className="w-full h-10">
                <Tabs
                  value={activeTabId || tabs[0]?.id}
                  onValueChange={onTabSelect}
                  className="h-auto flex-1"
                >
                  <TabsList className="h-10 rounded-none border-none bg-transparent p-0 w-full justify-start gap-0">
                    {tabs.map((tab) => (
                      <div
                        key={tab.id}
                        className="flex items-center shrink-0 border-r border-border/50 last:border-r-0"
                      >
                        <TabsTrigger
                          value={tab.id}
                          className={cn(
                            'data-[state=inactive]:bg-muted/20 data-[state=inactive]:text-muted-foreground',
                            'rounded-none border-b-2 border-transparent data-[state=active]:border-primary',
                            'px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap',
                            'flex items-center gap-1.5 sm:gap-2 h-10',
                            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
                            'transition-colors'
                          )}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Dirty indicator */}
                            {tab.isDirty && (
                              <Icon
                                name="circle"
                                className="size-2 fill-primary text-primary"
                                aria-label="unsaved changes"
                              />
                            )}
                            {tab.icon && (
                              <Icon
                                name={tab.icon}
                                size="xs"
                                className="text-muted-foreground shrink-0"
                              />
                            )}
                            {/* Tab name */}
                            <span className="truncate max-w-[120px] sm:max-w-[200px]">{tab.name}</span>
                          </div>
                        </TabsTrigger>

                        {/* Close button */}
                        {onTabClose && tab.canClose !== false && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onTabClose(tab.id)
                            }}
                            className={cn(
                              'h-8 w-8 mr-0.5',
                              'hover:bg-destructive/10 hover:text-destructive',
                              'focus-visible:ring-2 focus-visible:ring-ring',
                              'transition-colors'
                            )}
                            aria-label={`Close ${tab.name}`}
                          >
                            <Icon name="x" size="xs" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {onNewTab && (
                      <div className="flex items-center shrink-0 px-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNewTab()
                          }}
                          className={cn(
                            'h-8 w-8 text-muted-foreground hover:text-foreground',
                            'focus-visible:ring-2 focus-visible:ring-ring',
                            'transition-colors'
                          )}
                          aria-label="New document"
                          title="New document"
                        >
                          <Icon name="plus" size="xs" />
                        </Button>
                      </div>
                    )}
                  </TabsList>
                </Tabs>
              </ScrollArea>

              {canScrollRight && (
                <div
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-background to-transparent z-10"
                  aria-hidden="true"
                />
              )}
            </div>

            {showScrollArrows && canScrollRight && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleScrollRight}
                className="h-10 w-7 shrink-0 rounded-none border-l border-border/50 text-muted-foreground hover:text-foreground transition-colors z-10"
                aria-label="Scroll tabs right"
              >
                <Icon name="chevron-right" size="xs" />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
)

DocumentTabBar.displayName = 'DocumentTabBar'

