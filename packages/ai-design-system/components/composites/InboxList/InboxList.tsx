import * as React from "react"

import { Badge } from "@/components/primitives/Badge"

export interface InboxListItem {
  id: string
  title: string
  subtitle?: string
  preview?: string
  timestamp?: string
  badge?: string
}

export interface InboxListProps {
  items: InboxListItem[]
  selectedItemId?: string | null
  onSelectItem?: (itemId: string) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

function LoadingRows() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export const InboxList = React.memo<InboxListProps>(
  ({
    items,
    selectedItemId,
    onSelectItem,
    isLoading = false,
    emptyMessage = "No items found.",
    className,
  }) => {
    if (isLoading) {
      return (
        <div className={`min-h-0 flex-1 overflow-auto ${className ?? ""}`}>
          <LoadingRows />
        </div>
      )
    }

    if (!items.length) {
      return (
        <div className={`flex min-h-0 flex-1 items-center justify-center p-4 text-sm text-muted-foreground ${className ?? ""}`}>
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className={`min-h-0 flex-1 overflow-auto ${className ?? ""}`}>
        <div className="space-y-1 p-2">
          {items.map((item) => {
            const isSelected = selectedItemId === item.id

            return (
              <button
                key={item.id}
                type="button"
                className={`w-full rounded-md p-3 text-left transition-colors ${
                  isSelected
                    ? "bg-accent ring-1 ring-inset ring-primary"
                    : "bg-background hover:bg-accent/60"
                }`}
                onClick={() => onSelectItem?.(item.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="truncate font-medium text-sm">{item.title}</div>
                  {item.badge ? <Badge variant="outline">{item.badge}</Badge> : null}
                  {item.timestamp ? (
                    <div className="ml-auto shrink-0 text-muted-foreground text-xs">{item.timestamp}</div>
                  ) : null}
                </div>
                {item.subtitle ? (
                  <div className="mt-1 truncate text-muted-foreground text-xs">{item.subtitle}</div>
                ) : null}
                {item.preview ? <div className="mt-2 line-clamp-2 text-sm">{item.preview}</div> : null}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

InboxList.displayName = "InboxList"
