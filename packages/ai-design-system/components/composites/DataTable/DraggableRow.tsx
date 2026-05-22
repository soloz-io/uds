import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { flexRender, type Row } from "@tanstack/react-table"

import { TableCell, TableRow } from "@/components/primitives/Table"
import type { DashboardRow } from "./table-types"

export interface DraggableRowProps {
  row: Row<DashboardRow>
  rowId: number | string
}

export function DraggableRow({ row, rowId }: DraggableRowProps) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: rowId,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-row-id={String(rowId)}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}
