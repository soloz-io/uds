"use client"

import * as React from "react"
import { Button } from "@/components/primitives/Button"
import { Badge } from "@/components/primitives/Badge"
import { cn } from "@/lib/utils"
import type { CtaBannerProps } from "./interfaces"

export const CtaBanner = React.memo<CtaBannerProps>(
  ({
    title,
    description,
    badge,
    primaryAction,
    secondaryAction,
    className,
  }) => {
    return (
      <section
        className={cn(
          "w-full max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center text-center gap-6 rounded-3xl border border-border/60 bg-card/80 p-8 md:p-16 shadow-sm">
          {badge && (
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              {badge}
            </Badge>
          )}

          <div className="flex flex-col items-center gap-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            {description && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {primaryAction && (
                primaryAction.href ? (
                  <Button size="lg" asChild>
                    <a href={primaryAction.href} onClick={primaryAction.onClick}>
                      {primaryAction.label}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" onClick={primaryAction.onClick}>
                    {primaryAction.label}
                  </Button>
                )
              )}

              {secondaryAction && (
                secondaryAction.href ? (
                  <Button variant="outline" size="lg" asChild>
                    <a href={secondaryAction.href} onClick={secondaryAction.onClick}>
                      {secondaryAction.label}
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" onClick={secondaryAction.onClick}>
                    {secondaryAction.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </section>
    )
  }
)

CtaBanner.displayName = "CtaBanner"
