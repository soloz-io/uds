import * as React from "react"

export interface CtaBannerAction {
  label: string
  onClick?: () => void
  href?: string
}

export interface CtaBannerProps {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: string
  primaryAction?: CtaBannerAction
  secondaryAction?: CtaBannerAction
  className?: string
}
