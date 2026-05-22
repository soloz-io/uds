import { Badge } from "@/components/primitives/Badge"
import { CheckCircle2, LoaderCircle, CircleSlash } from "lucide-react"

import type { DashboardRow } from "./table-types"

export interface StatusCellProps {
  status: DashboardRow["status"]
}

export function StatusCell({ status }: StatusCellProps) {
  return (
    <Badge variant="outline" className="gap-1 px-1.5 text-muted-foreground">
      {status === "Done" ? <CheckCircle2 className="size-3 text-green-500" /> : null}
      {status === "In Process" ? <LoaderCircle className="size-3 animate-spin" /> : null}
      {status === "Not Started" ? <CircleSlash className="size-3" /> : null}
      {status}
    </Badge>
  )
}
