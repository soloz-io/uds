"use client"

import * as React from "react"
import { PromptInput } from "@/components/composites/PromptInput"
import { cn } from "@/lib/utils"
import type { HeroSectionProps } from "./interfaces"

export const HeroSection = React.memo<HeroSectionProps>(
  ({
    headline,
    subtitle,
    videoNode,
    videoPosition = "top",
    videoAspectRatio = "video",
    promptPlaceholder = "Describe what you want to create",
    promptValue,
    promptHelperText,
    multilinePrompt,
    onPromptChange,
    promptInputProps,
    onPromptSubmit,
    contentRef,
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
      {/* Video Card Slot (when top) */}
      {videoNode && videoPosition === "top" && (
        <div
          className={cn(
            "rounded-2xl overflow-hidden bg-foreground/5 flex items-center justify-center border border-border/40 shadow-sm",
            videoAspectRatio === "vertical"
              ? "w-64 sm:w-72 aspect-[9/16]"
              : "w-full max-w-sm aspect-video"
          )}
        >
          {videoNode}
        </div>
      )}

      {/* Interactive Content Slot (Headline, Subtitle, Prompt Input) */}
      <div
        ref={contentRef}
        id="hero-content-section"
        className="flex flex-col items-center gap-8 w-full scroll-mt-6 md:scroll-mt-10"
      >
        {/* Headline & Subtitle */}
        {(headline || subtitle) && (
          <div className="flex flex-col items-center gap-3 text-center max-w-3xl">
            {headline && (
              <h1 className="text-4xl md:text-5xl font-semibold text-center tracking-tight text-foreground">
                {headline}
              </h1>
            )}
            {subtitle && (
              <p className="text-base md:text-lg text-muted-foreground text-center">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Prompt Input */}
        <div id="hero-prompt-input" className="w-full max-w-2xl">
          <PromptInput
            placeholder={promptPlaceholder}
            value={promptValue}
            helperText={promptHelperText}
            multiline={multilinePrompt ?? Boolean(promptHelperText || promptValue)}
            onChange={onPromptChange}
            onSubmit={onPromptSubmit ?? handleFallbackSubmit}
            {...promptInputProps}
          />
        </div>
      </div>

      {/* Video Card Slot (when bottom) */}
      {videoNode && videoPosition === "bottom" && (
        <div
          className={cn(
            "rounded-2xl overflow-hidden bg-foreground/5 flex items-center justify-center border border-border/40 shadow-sm mt-2",
            videoAspectRatio === "vertical"
              ? "w-64 sm:w-72 aspect-[9/16]"
              : "w-full max-w-2xl aspect-video"
          )}
        >
          {videoNode}
        </div>
      )}
    </section>
  )
  }
)

HeroSection.displayName = "HeroSection"
