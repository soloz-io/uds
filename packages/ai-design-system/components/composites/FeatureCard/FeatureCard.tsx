"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { FeatureCardProps } from "./interfaces"

export const FeatureCard = React.memo<FeatureCardProps>(
  ({
    category,
    headline,
    body,
    action,
    imageSrc,
    imageAlt,
    mediaNode,
    mediaPosition = "right",
    className,
  }) => {
    const textPane = (
      <div className="flex flex-col justify-center gap-4 flex-1 p-8 md:p-12 bg-card/60">
        {category && (
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {category}
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-foreground">
          {headline}
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-md">
          {body}
        </p>
        {action && (
          <div className="pt-2">
            {action.href ? (
              <a
                href={action.href}
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
              >
                <span>{action.label}</span>
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0 p-0"
              >
                <span>{action.label}</span>
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}
      </div>
    )

    const mediaPane = (
      <div className="flex-1 bg-muted/40 overflow-hidden flex items-center justify-center">
        {mediaNode ? (
          mediaNode
        ) : imageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}
            alt={imageAlt || (typeof headline === "string" ? headline : "Feature preview")}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
            Preview
          </div>
        )}
      </div>
    )

    return (
      <div
        className={cn(
          "flex overflow-hidden rounded-3xl min-h-[460px] shadow-sm w-full bg-card/60",
          mediaPosition === "left"
            ? "flex-col-reverse md:flex-row-reverse"
            : "flex-col md:flex-row",
          className
        )}
      >
        {textPane}
        {mediaPane}
      </div>
    )
  }
)

FeatureCard.displayName = "FeatureCard"
