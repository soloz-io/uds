import type * as React from "react"

export interface AnnouncementBannerProps {
  message: React.ReactNode
  actionText?: string
  href?: string
  onAction?: () => void
  className?: string
}
