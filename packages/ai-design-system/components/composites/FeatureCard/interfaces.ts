import type * as React from "react"

export interface FeatureCardAction {
  label: string
  href?: string
  onClick?: () => void
}

export interface FeatureCardProps {
  category?: React.ReactNode
  headline: React.ReactNode
  body: React.ReactNode
  action?: FeatureCardAction
  imageSrc?: string
  imageAlt?: string
  mediaNode?: React.ReactNode
  mediaPosition?: "left" | "right"
  className?: string
}
