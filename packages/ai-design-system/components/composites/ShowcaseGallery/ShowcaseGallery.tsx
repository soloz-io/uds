"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/primitives/Dialog"
import { cn } from "@/lib/utils"
import { ShowcaseCard } from "./ShowcaseCard"
import type { ShowcaseGalleryProps, ShowcaseItem } from "./interfaces"

export const ShowcaseGallery = React.memo<ShowcaseGalleryProps>(
  ({
    eyebrow,
    title,
    description,
    items = [],
    columns = 3,
    onUsePrompt,
    children,
    className,
  }) => {
    const [selectedItem, setSelectedItem] = React.useState<ShowcaseItem | null>(null)

    const columnClass =
      columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

    const handleSelect = React.useCallback((item: ShowcaseItem) => {
      setSelectedItem(item)
    }, [])

    const handleClose = React.useCallback(() => {
      setSelectedItem(null)
    }, [])

    const handleUsePrompt = React.useCallback(() => {
      if (!selectedItem) return
      if (selectedItem.onUsePrompt && selectedItem.prompt) {
        selectedItem.onUsePrompt(selectedItem.prompt)
      }
      if (onUsePrompt && selectedItem.prompt) {
        onUsePrompt(selectedItem.prompt, selectedItem)
      }
      setSelectedItem(null)
    }, [selectedItem, onUsePrompt])

    return (
      <section
        className={cn(
          "flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 gap-8",
          className
        )}
      >
        {/* Split Header matching Image 1 */}
        {(eyebrow || title || description) && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="flex flex-col gap-2 max-w-xl">
              {eyebrow && (
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground">
                  {title}
                </h2>
              )}
            </div>
            {description && (
              <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 3-column Grid matching Image 1 */}
        <div className={cn("grid gap-6 md:gap-8 w-full", columnClass)}>
          {children
            ? children
            : items.map((item, idx) => (
                <ShowcaseCard
                  key={item.id || (typeof item.title === "string" ? `${item.title}-${idx}` : idx)}
                  {...item}
                  onSelect={() => handleSelect(item)}
                />
              ))}
        </div>

        {/* Modal Player matching Image 3 */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && handleClose()}>
          <DialogContent
            className="max-w-5xl w-full max-h-[85vh] h-[640px] p-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl flex flex-col md:flex-row sm:max-w-5xl [&>button]:hidden"
          >
            <DialogTitle className="sr-only">
              {selectedItem?.title || "Video Preview"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {selectedItem?.prompt || "Video playback and prompt details"}
            </DialogDescription>

            {/* Left Side: Proper Video Player Container */}
            <div className="flex-1 bg-black relative flex items-center justify-center p-3 md:p-6 overflow-hidden h-1/2 md:h-full min-h-0">
              {selectedItem?.videoSrc ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <video
                    src={selectedItem.videoSrc}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full w-auto h-auto rounded-xl object-contain shadow-2xl"
                  >
                    <track kind="captions" />
                  </video>
                </div>
              ) : selectedItem?.mediaNode ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {selectedItem.mediaNode}
                </div>
              ) : selectedItem?.imageSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedItem.imageSrc}
                  alt={selectedItem.title}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <div className="text-muted-foreground text-sm">No preview available</div>
              )}
            </div>

            {/* Right Side: Sidebar Panel */}
            <div className="w-full md:w-80 lg:w-96 bg-zinc-900/95 p-6 flex flex-col justify-between gap-6 border-t md:border-t-0 md:border-l border-zinc-800 shrink-0 h-1/2 md:h-full overflow-hidden">
              <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                <div className="flex items-start justify-between gap-2 shrink-0">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {selectedItem?.title}
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
                    aria-label="Close dialog"
                  >
                    ✕
                  </button>
                </div>

                {/* Engine / Model Badge */}
                {selectedItem?.engineBadge && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 shrink-0">
                    <span aria-hidden="true">⚗</span>
                    <span>{selectedItem.engineBadge}</span>
                  </div>
                )}

                {/* Prompt Body */}
                {selectedItem?.prompt && (
                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {selectedItem.prompt}
                  </p>
                )}
              </div>

              {/* Action Button: Use this Prompt */}
              <div className="pt-2 shrink-0">
                <button
                  type="button"
                  onClick={handleUsePrompt}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer text-center"
                >
                  Use this Prompt
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    )
  }
)

ShowcaseGallery.displayName = "ShowcaseGallery"
