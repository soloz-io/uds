import { Badge } from "@/components/primitives/Badge"
import { Icon } from "@/components/primitives/Icon"

import type { DashboardRow } from "./table-types"

export interface StatusCellProps {
  status: DashboardRow["status"]
}

export function StatusCell({ status }: StatusCellProps) {
  return (
    <Badge variant="outline" className="gap-1 px-1.5 text-muted-foreground">
      {status === "Done" ? <Icon name="circle-check" size="xs" className="text-green-500" /> : null}
      {status === "In Process" ? <Icon name="loader-2" size="xs" className="animate-spin" /> : null}
      {status === "Not Started" ? <Icon name="circle-slash" size="xs" /> : null}
      {status as React.ReactNode}
    </Badge>
  )
}
