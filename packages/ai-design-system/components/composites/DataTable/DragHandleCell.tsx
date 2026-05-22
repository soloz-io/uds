import { useSortable } from "@dnd-kit/sortable"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/primitives/Button"

export interface DragHandleCellProps {
  id: number
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
      <GripVertical className="size-3" />
    </Button>
  )
}
