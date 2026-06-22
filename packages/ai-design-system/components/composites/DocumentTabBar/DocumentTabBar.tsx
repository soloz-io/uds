/**
 * DocumentTabBar Composite
 * 
 * VS Code-style tab bar for multi-document editors.
 * Displays open documents as closeable tabs with dirty indicators.
 */

import React from 'react'
import { Tabs, TabsList, TabsTrigger, Button, ScrollArea } from '@/components/primitives'
import { X, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
export interface DocumentFile {
  id: string
  name: string
  isDirty?: boolean
  format?: string
  lastModified?: number
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
 * - Scrollable when tabs overflow horizontally
 * - Accessible tab navigation via Radix UI Tabs
 * - Close button to remove tabs
 * - Dirty state indicator
 */
export const DocumentTabBar = React.memo<DocumentTabBarProps>(
  ({ tabs, activeTabId, onTabSelect, onTabClose, className }) => {
    if (tabs.length === 0) {
      return null
    }

    return (
      <div
        className={cn(
          'flex items-center border-b border-border bg-background',
          className
        )}
        data-slot="document-tab-bar"
      >
        <ScrollArea className="flex-1">
          <Tabs
            value={activeTabId || tabs[0]?.id}
            onValueChange={onTabSelect}
            className="h-auto flex-1"
          >
            <TabsList className="h-10 rounded-none border-none bg-transparent p-0 w-full justify-start gap-0">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center border-r border-border/50 last:border-r-0"
                >
                  <TabsTrigger
                    value={tab.id}
                    className={cn(
                      'data-[state=inactive]:bg-muted/20 data-[state=inactive]:text-muted-foreground',
                      'rounded-none border-b-2 border-transparent data-[state=active]:border-primary',
                      'px-3 py-2 text-sm font-medium whitespace-nowrap',
                      'flex items-center gap-2 h-10',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
                      'transition-colors'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {/* Dirty indicator */}
                      {tab.isDirty && (
                        <Circle
                          className="size-2 fill-primary text-primary flex-shrink-0"
                          aria-label="unsaved changes"
                        />
                      )}
                      {/* Tab name */}
                      <span className="truncate max-w-[200px]">{tab.name}</span>
                    </div>
                  </TabsTrigger>

                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTabClose?.(tab.id)
                    }}
                    className={cn(
                      'h-8 w-8 mr-0.5',
                      'hover:bg-destructive/10 hover:text-destructive',
                      'focus-visible:ring-2 focus-visible:ring-ring',
                      'transition-colors'
                    )}
                    aria-label={`Close ${tab.name}`}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
            </TabsList>
          </Tabs>
        </ScrollArea>
      </div>
    )
  }
)

DocumentTabBar.displayName = 'DocumentTabBar'
