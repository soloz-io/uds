import * as React from "react"

import { InboxList, type InboxListItem } from "@/components/composites/InboxList"
import { Input } from "@/components/primitives/Input"

export interface InboxPanelProps {
  items: InboxListItem[]
  selectedItemId?: string | null
  onSelectItem?: (itemId: string) => void
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  searchPlaceholder?: string
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  title?: string
  headerAction?: React.ReactNode
}

export const InboxPanel = React.memo<InboxPanelProps>(
  ({
    items,
    selectedItemId,
    onSelectItem,
    searchQuery = "",
    onSearchQueryChange,
    searchPlaceholder = "Type to search...",
    isLoading = false,
    emptyMessage,
    className,
    title,
    headerAction,
  }) => {
    return (
      <section className={`flex min-h-0 flex-1 flex-col overflow-hidden ${className ?? ""}`}>
        {title || headerAction ? (
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            {title ? <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2> : <div />}
            {headerAction ? <div>{headerAction}</div> : null}
          </div>
        ) : null}

        <div className="px-4 pt-4 pb-2">
          <Input
            aria-label="Search inbox items"
            className="h-8"
            onChange={(event) => onSearchQueryChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            value={searchQuery}
          />
        </div>

        <InboxList
          className="min-h-0 flex-1"
          emptyMessage={emptyMessage}
          isLoading={isLoading}
          items={items}
          onSelectItem={onSelectItem}
          selectedItemId={selectedItemId}
        />
      </section>
    )
  }
)

InboxPanel.displayName = "InboxPanel"
