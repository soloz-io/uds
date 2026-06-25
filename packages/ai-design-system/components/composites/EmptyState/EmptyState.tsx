import * as React from "react"

import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"

export interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
  className?: string
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, actionLabel, onAction, className }, ref) => {
    return (
      <div 
        ref={ref}
        className={`flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center shadow-md max-w-[420px] w-full mx-auto ${className || ""}`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 mb-6">
          <Icon name="plus" size="lg" className="text-muted-foreground" />
        </div>
        <h3 className="mb-3 text-xl font-semibold tracking-tight text-card-foreground">
          {title}
        </h3>
        <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <Button onClick={onAction} variant="secondary" className="rounded-full px-6 py-5 font-medium">
          {actionLabel}
        </Button>
      </div>
    )
  }
)

EmptyState.displayName = "EmptyState"
