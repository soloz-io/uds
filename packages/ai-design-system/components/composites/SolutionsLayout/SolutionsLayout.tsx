"use client"

import * as React from "react"
import { Button } from "@/components/primitives/Button"
import { FeatureCard } from "@/components/composites/FeatureCard"
import { cn } from "@/lib/utils"
import type { SolutionsLayoutProps } from "./interfaces"

export const SolutionsLayout = React.memo<SolutionsLayoutProps>(
  ({
    title,
    subtitle,
    tabs,
    defaultTabId,
    activeTabId,
    onTabChange,
    onPreviousTab,
    onNextTab,
    className,
  }) => {
    const [internalActiveId, setInternalActiveId] = React.useState<string>(
      defaultTabId || tabs[0]?.id || ""
    )

    const currentActiveId = activeTabId ?? internalActiveId

    const handleTabChange = React.useCallback(
      (newId: string) => {
        setInternalActiveId(newId)
        onTabChange?.(newId)
      },
      [onTabChange]
    )

    const currentIndex = tabs.findIndex((t) => t.id === currentActiveId)
    const activeTab = tabs[currentIndex] ?? tabs[0]

    const handlePrevious = React.useCallback(() => {
      if (onPreviousTab) {
        onPreviousTab()
      } else {
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
        handleTabChange(tabs[prevIndex]?.id || "")
      }
    }, [currentIndex, tabs, onPreviousTab, handleTabChange])

    const handleNext = React.useCallback(() => {
      if (onNextTab) {
        onNextTab()
      } else {
        const nextIndex = (currentIndex + 1) % tabs.length
        handleTabChange(tabs[nextIndex]?.id || "")
      }
    }, [currentIndex, tabs, onNextTab, handleTabChange])

    return (
      <main className={cn("flex flex-col items-center px-4 md:px-8 pt-12 md:pt-16 pb-16 gap-6 max-w-5xl mx-auto w-full", className)}>
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto pb-2">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-foreground">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground text-center">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Tab switcher — plain buttons so flex-wrap rows never get clipped */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 w-full max-w-3xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "px-4 py-1 text-sm rounded-full transition-colors outline-none border-0 cursor-pointer",
                  tab.id === currentActiveId
                    ? "bg-muted/80 text-foreground font-medium"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* 50/50 Split Card */}
        {activeTab && (
          <FeatureCard
            category={activeTab.category}
            headline={activeTab.headline}
            body={activeTab.body}
            imageSrc={activeTab.imageSrc}
            imageAlt={activeTab.imageAlt || activeTab.label}
            mediaPosition="right"
          />
        )}

        {/* Navigation footer: Previous / Next */}
        <div className="flex items-center justify-between w-full px-2 pt-2 text-sm text-muted-foreground">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            ← Previous
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            Next →
          </Button>
        </div>
      </main>
    )
  }
)

SolutionsLayout.displayName = "SolutionsLayout"
