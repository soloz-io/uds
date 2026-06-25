import { useSortable } from "@dnd-kit/sortable"

import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"

export interface DragHandleCellProps {
  id: number | string
}

export function DragHandleCell({ id }: DragHandleCellProps) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
      aria-label="Drag to reorder"
    >
      <Icon name="grip-vertical" size="xs" />
    </Button>
  )
}
