import type * as React from "react"

export interface FaqItem {
  id: string
  question: string
  answer: React.ReactNode
}

export interface FaqSectionProps {
  title?: string
  subtitle?: string
  items: FaqItem[]
  className?: string
}
