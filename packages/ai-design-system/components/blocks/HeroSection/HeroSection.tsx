"use client"

import * as React from "react"
import { PromptInput } from "@/components/composites/PromptInput"
import { cn } from "@/lib/utils"
import type { HeroSectionProps } from "./interfaces"

export const HeroSection = React.memo<HeroSectionProps>(
  ({
    headline,
    videoNode,
    promptPlaceholder = "Describe what you want to create",
    promptInputProps,
    onPromptSubmit,
    className,
  }) => {
  const handleFallbackSubmit = React.useCallback(() => {}, [])

  return (
    <section
      className={cn(
        "flex flex-col items-center flex-1 pt-16 pb-8 px-6 gap-8 max-w-4xl mx-auto w-full",
        className
      )}
    >
      {/* Video Card Slot */}
      {videoNode && (
        <div className="w-full max-w-sm rounded-xl overflow-hidden aspect-video bg-foreground/5 flex items-center justify-center border">
          {videoNode}
        </div>
      )}

      {/* Headline */}
      {headline && (
        <h1 className="text-4xl md:text-5xl font-semibold text-center tracking-tight text-foreground">
          {headline}
        </h1>
      )}

      {/* Prompt Input */}
      <div className="w-full max-w-2xl">
        <PromptInput
          placeholder={promptPlaceholder}
          onSubmit={onPromptSubmit ?? handleFallbackSubmit}
          {...promptInputProps}
        />
      </div>
    </section>
  )
  }
)

HeroSection.displayName = "HeroSection"
