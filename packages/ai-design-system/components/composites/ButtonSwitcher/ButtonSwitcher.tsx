import * as React from "react"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Icon } from "@/components/primitives/Icon"

export interface ButtonSwitcherItem {
  id: string
  name: string
  /** The menu lists each group once, opening its items on demand; an item without one is listed directly. */
  group?: string
}

export interface ButtonSwitcherProps {
  items: ButtonSwitcherItem[]
  activeId?: string | null
  onSelect: (id: string) => void
  className?: string
  placeholder?: string
}

export const ButtonSwitcher = React.memo<ButtonSwitcherProps>(
  ({ items, activeId, onSelect, className, placeholder = "Select Item" }) => {
    const currentItem = items.find((w) => w.id === activeId)
    // Groups in the order their first item appears; ungrouped items in place.
    const entries = React.useMemo(() => {
      const out: Array<{ kind: "item"; item: ButtonSwitcherItem } | { kind: "group"; group: string; items: ButtonSwitcherItem[] }> = []
      for (const item of items) {
        if (!item.group) {
          out.push({ kind: "item", item })
          continue
        }
        const existing = out.find((e) => e.kind === "group" && e.group === item.group)
        if (existing && existing.kind === "group") existing.items.push(item)
        else out.push({ kind: "group", group: item.group, items: [item] })
      }
      return out
    }, [items])

    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 border hover:bg-black/5 dark:hover:bg-white/5"
              size="sm"
              title="Select workflow"
              variant="secondary"
            >
              <span className="truncate max-w-[150px]">
                {currentItem?.name ?? placeholder}
              </span>
              <Icon name="chevron-down" size="xs" className="ml-1 opacity-50 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {entries.map((entry) =>
              entry.kind === "item" ? (
                <DropdownMenuItem className="flex items-center justify-between" key={entry.item.id} onClick={() => onSelect(entry.item.id)}>
                  <span className="truncate pr-4">{entry.item.name}</span>
                  {entry.item.id === activeId && <Icon name="check" size="sm" className="ml-auto shrink-0" />}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuSub key={`group:${entry.group}`}>
                  <DropdownMenuSubTrigger className={entry.items.some((w) => w.id === activeId) ? "font-medium" : undefined}>
                    <span className="truncate pr-4">{entry.group}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {entry.items.map((w) => (
                      <DropdownMenuItem className="flex items-center justify-between" key={w.id} onClick={() => onSelect(w.id)}>
                        <span className="truncate pr-4">{w.name}</span>
                        {w.id === activeId && <Icon name="check" size="sm" className="ml-auto shrink-0" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ),
            )}
            {items.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                No items found
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)

ButtonSwitcher.displayName = "ButtonSwitcher"
