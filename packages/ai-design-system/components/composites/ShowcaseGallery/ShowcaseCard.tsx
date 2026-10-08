"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { ShowcaseCardProps } from "./interfaces"

export const ShowcaseCard = React.memo<ShowcaseCardProps>(
  ({
    title,
    imageSrc,
    imageAlt,
    mediaNode,
    previewButtonLabel = "Preview video",
    onSelect,
    className,
  }) => {
    return (
      <div
        className={cn(
          "group flex flex-col cursor-pointer transition-opacity hover:opacity-95 text-left",
          className
        )}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect?.()
          }
        }}
      >
        {/* 16:9 Thumbnail Slot */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-3xl bg-muted/60 border border-border/20 shadow-xs">
          {mediaNode ? (
            mediaNode
          ) : imageSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Preview
            </div>
          )}

          {/* Bottom-right Preview video pill */}
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-medium border border-white/10 shadow-sm transition-all group-hover:bg-black/90">
              <span className="text-[10px] leading-none" aria-hidden="true">
                ▶
              </span>
              <span>{previewButtonLabel}</span>
            </span>
          </div>
        </div>

        {/* Clean, unboxed Title below thumbnail */}
        <div className="mt-3">
          <h3 className="text-base font-semibold text-foreground tracking-tight transition-colors group-hover:text-foreground/90">
            {title}
          </h3>
        </div>
      </div>
    )
  }
)

ShowcaseCard.displayName = "ShowcaseCard"
