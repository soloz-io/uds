"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { FeatureSectionProps } from "./interfaces"

export const FeatureSection = React.memo<FeatureSectionProps>(
  ({ title, subtitle, children, className }) => {
    return (
      <section
        className={cn(
          "flex flex-col items-center px-4 md:px-8 py-12 md:py-16 gap-6 max-w-5xl mx-auto w-full",
          className
        )}
      >
        {(title || subtitle) && (
          <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto pb-2">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground text-center">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </section>
    )
  }
)

FeatureSection.displayName = "FeatureSection"
