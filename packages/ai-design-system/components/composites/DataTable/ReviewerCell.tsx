import * as React from "react"

import { Label } from "@/components/primitives/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/Select"

import type { DashboardRow } from "./table-types"

const reviewerOptions = ["Eddie Lake", "Jamik Tashpulatov", "Emily Whalen"]

export interface ReviewerCellProps {
  row: DashboardRow
  onAssign: (rowId: number, reviewer: string) => void
}

export function ReviewerCell({ row, onAssign }: ReviewerCellProps) {
  const isAssigned = row.reviewer !== "Assign reviewer"

  if (isAssigned) {
    return <span>{row.reviewer as React.ReactNode}</span>
  }

  const id = `${row.id}-reviewer`

  return (
    <>
      <Label htmlFor={id} className="sr-only">
        Reviewer
      </Label>
      <Select onValueChange={(value) => onAssign(row.id as number, value)}>
        <SelectTrigger id={id} className="w-[170px]">
          <SelectValue placeholder="Assign reviewer" />
        </SelectTrigger>
        <SelectContent align="end">
          {reviewerOptions.map((reviewer) => (
            <SelectItem key={reviewer} value={reviewer}>
              {reviewer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
