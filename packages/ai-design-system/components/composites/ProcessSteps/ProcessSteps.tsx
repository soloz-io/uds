"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { ProcessStepsProps } from "./interfaces"

export const ProcessSteps = React.memo<ProcessStepsProps>(
  ({ title, subtitle, steps = [], className }) => {
    return (
      <section
        className={cn(
          "flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 gap-8",
          className
        )}
      >
        {(title || subtitle) && (
          <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {steps.map((item, idx) => (
            <div
              key={typeof item.step === "string" ? item.step : idx}
              className="flex flex-col justify-between gap-6 rounded-2xl border border-border/50 bg-card/60 p-6 md:p-8 transition-colors hover:border-border"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-muted-foreground/70 tracking-tight">
                    {String(item.step).padStart(2, "0")}
                  </span>
                  {item.tag && (
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground px-2 py-0.5 rounded bg-muted">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {(item.mediaNode || item.imageSrc) && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted/40 border border-border/40 mt-2 flex items-center justify-center">
                  {item.mediaNode ? (
                    item.mediaNode
                  ) : item.imageSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }
)

ProcessSteps.displayName = "ProcessSteps"
