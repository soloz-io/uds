import * as React from "react"
import { toast } from "sonner"

import { Input } from "@/components/primitives/Input"
import { Label } from "@/components/primitives/Label"
import type { DashboardRow } from "./table-types"

export interface InlineEditCellProps {
  row: DashboardRow
  field: "target" | "limit"
  onSave: (rowId: number, field: "target" | "limit", value: string) => void
}

export function InlineEditCell({ row, field, onSave }: InlineEditCellProps) {
  const inputId = `${row.id}-${field}`
  const defaultValue = row[field]

  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const value = String(formData.get(field) ?? "").trim()
      onSave(row.id, field, value)
      toast.success(`Saved ${field} for ${row.header}`)
    },
    [field, onSave, row.header, row.id]
  )

  return (
    <form onSubmit={onSubmit}>
      <Label htmlFor={inputId} className="sr-only">
        {field}
      </Label>
      <Input
        id={inputId}
        name={field}
        defaultValue={defaultValue}
        className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
        onBlur={(event) => {
          onSave(row.id, field, event.target.value)
        }}
      />
    </form>
  )
}
