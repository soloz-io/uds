import type * as React from "react"

export interface ShowcaseItem {
  id?: string
  title: string
  prompt?: string
  engineBadge?: string
  imageSrc?: string
  imageAlt?: string
  videoSrc?: string
  mediaNode?: React.ReactNode
  previewButtonLabel?: string
  onUsePrompt?: (prompt: string) => void
}

export interface ShowcaseCardProps extends ShowcaseItem {
  onSelect?: () => void
  className?: string
}

export interface ShowcaseGalleryProps {
  eyebrow?: string
  title?: string
  description?: string
  items?: ShowcaseItem[]
  columns?: 2 | 3 | 4
  onUsePrompt?: (prompt: string, item: ShowcaseItem) => void
  children?: React.ReactNode
  className?: string
}
