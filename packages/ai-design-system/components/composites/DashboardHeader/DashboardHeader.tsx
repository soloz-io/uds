import * as React from "react"

import { Button } from "@/components/primitives/Button"

export interface DashboardHeaderProps {
  ctaLabel?: string
}

export const DashboardHeader = React.memo<DashboardHeaderProps>(({ ctaLabel = "Quick Create" }) => {
  return (
    <>
      <Button variant="outline" size="sm" className="hidden sm:flex">
        {ctaLabel}
      </Button>
      <div className="text-xs text-muted-foreground">GitHub</div>
    </>
  )
})

DashboardHeader.displayName = "DashboardHeader"


