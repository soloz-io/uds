"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { AnnouncementBannerProps } from "./interfaces"

export const AnnouncementBanner = React.memo<AnnouncementBannerProps>(
  ({ message, actionText, href, onAction, className }) => {
    const content = (
      <div className="flex items-center justify-center gap-2 text-sm text-foreground hover:opacity-80 transition-opacity">
        <span>{message}</span>
        {actionText && <span className="font-medium underline">{actionText}</span>}
      </div>
    )

    return (
      <div
        className={cn(
          "w-full border-b bg-muted/40 py-2.5 px-4 text-center",
          className
        )}
      >
        {href ? (
          <a
            href={href}
            onClick={(e) => {
              if (onAction) {
                e.preventDefault()
                onAction()
              }
            }}
            className="inline-block"
          >
            {content}
          </a>
        ) : onAction ? (
          <button type="button" onClick={onAction} className="inline-block cursor-pointer">
            {content}
          </button>
        ) : (
          content
        )}
      </div>
    )
  }
)

AnnouncementBanner.displayName = "AnnouncementBanner"
