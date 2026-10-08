import * as React from "react"

export interface ProcessStepItem {
  step: string | number
  title: string
  description: string
  tag?: string
  mediaNode?: React.ReactNode
  imageSrc?: string
}

export interface ProcessStepsProps {
  title?: string
  subtitle?: string
  steps: ProcessStepItem[]
  className?: string
}
