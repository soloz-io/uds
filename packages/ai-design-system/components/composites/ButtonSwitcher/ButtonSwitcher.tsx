import * as React from "react"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Icon } from "@/components/primitives/Icon"

export interface ButtonSwitcherItem {
  id: string
  name: string
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
            {items.map((w) => (
              <DropdownMenuItem
                className="flex items-center justify-between"
                key={w.id}
                onClick={() => onSelect(w.id)}
              >
                <span className="truncate pr-4">{w.name}</span>
                {w.id === activeId && <Icon name="check" size="sm" className="ml-auto shrink-0" />}
              </DropdownMenuItem>
            ))}
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
