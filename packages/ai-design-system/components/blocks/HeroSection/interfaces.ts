import type * as React from "react"
import type { PromptInputBlockProps } from "@/components/composites/PromptInput"
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input"

export interface HeroSectionProps {
  headline?: React.ReactNode
  videoNode?: React.ReactNode
  promptPlaceholder?: string
  promptInputProps?: PromptInputBlockProps
  onPromptSubmit?: (message: PromptInputMessage, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  className?: string
}
