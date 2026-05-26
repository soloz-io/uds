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
  }) => {
    return (
      <section className={`flex min-h-0 flex-1 flex-col overflow-hidden ${className ?? ""}`}>
        <div className="p-4">
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
