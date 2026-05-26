import * as React from "react"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { cn } from "@/lib/utils"
import type { LoadingShimmerProps } from "./interfaces"

export const LoadingShimmer = React.memo<LoadingShimmerProps>(({ message = "Loading...", className }) => {
  return (
    <div className={cn("flex h-full min-h-0 flex-1 items-center justify-center px-6 py-10", className)}>
      <div className="w-full max-w-3xl space-y-5">
        <Shimmer className="text-sm text-muted-foreground">{message}</Shimmer>
        <div className="space-y-3">
          <div className="h-10 w-1/3 animate-pulse rounded-md bg-muted/70" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-muted/60" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-36 animate-pulse rounded-xl bg-muted/55" />
            <div className="h-36 animate-pulse rounded-xl bg-muted/55" />
          </div>
        </div>
      </div>
    </div>
  )
})

LoadingShimmer.displayName = "LoadingShimmer"