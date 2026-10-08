import type * as React from "react"
import type { PromptInputBlockProps } from "@/components/composites/PromptInput"
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input"

export interface HeroSectionProps {
  headline?: React.ReactNode
  subtitle?: React.ReactNode
  videoNode?: React.ReactNode
  videoPosition?: "top" | "bottom"
  videoAspectRatio?: "video" | "vertical"
  promptPlaceholder?: string
  promptValue?: string
  promptHelperText?: React.ReactNode
  multilinePrompt?: boolean
  onPromptChange?: (value: string) => void
  promptInputProps?: PromptInputBlockProps
  onPromptSubmit?: (message: PromptInputMessage, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  contentRef?: React.Ref<HTMLDivElement>
  className?: string
}
