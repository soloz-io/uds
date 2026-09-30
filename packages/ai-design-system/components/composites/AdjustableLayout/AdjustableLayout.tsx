import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/primitives/Tabs"

export interface AdjustableLayoutSection {
  id: string
  content: React.ReactNode
  label?: string
  title?: string
  fixedSize?: string // CSS size value, e.g. "16rem"
  defaultSize?: number // percentage (0-100)
  minSize?: number // minimum percentage
  maxSize?: number // maximum percentage
  resizable?: boolean // default true for >1 sections
  className?: string
  variant?: "default" | "ghost"
}

export interface AdjustableLayoutProps extends React.ComponentPropsWithoutRef<"div"> {
  sections: AdjustableLayoutSection[]
  orientation?: "horizontal" | "vertical"
  storageKey?: string // localStorage key for persistence
  onSectionResize?: (sectionId: string, newSize: number) => void
  dragHandleColor?: "primary" | "secondary" | "accent" | "border" | "muted"
  padded?: boolean
  /**
   * Layout behavior on mobile screens (< 768px).
   * - 'tabs': Renders a mobile tab bar/segmented control to toggle between panels (default)
   * - 'stack': Stacks panels vertically (flex-col)
   * - 'none': Keeps standard orientation without mobile adaptation
   * @default 'tabs'
   */
  mobileBehavior?: "tabs" | "stack" | "none"
  /**
   * Whether to hide the mobile tab bar when mobileBehavior is "tabs".
   * Used when switching between panels is driven by internal controls (e.g. Overview / Show Chat).
   * @default false
   */
  hideMobileTabs?: boolean
  /**
   * Active section ID in mobile tabs mode (for controlled usage).
   */
  activeSectionId?: string
  /**
   * Callback when active section changes in mobile tabs mode.
   */
  onActiveSectionChange?: (sectionId: string) => void
}

function formatSectionTitle(id: string): string {
  if (!id) return "Panel"
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * AdjustableLayout Block
 *
 * A flexible layout component with 1-4 resizable panels.
 * Follows Oranger's resizing mechanism with drag handles between panels.
 * Supports localStorage persistence and responsive behavior.
 */
export const AdjustableLayout = React.memo<AdjustableLayoutProps>(
  ({
    sections,
    orientation = "horizontal",
    storageKey,
    onSectionResize,
    dragHandleColor = "border",
    className,
    padded = false,
    mobileBehavior = "tabs",
    hideMobileTabs = false,
    activeSectionId,
    onActiveSectionChange,
    ...props
  }) => {
    // Color mapping for drag handles
    const colorMap = {
      primary: "bg-primary hover:bg-primary/90",
      secondary: "bg-secondary hover:bg-secondary/80",
      accent: "bg-accent hover:bg-accent/80",
      border: "bg-border hover:bg-border/80",
      muted: "bg-muted hover:bg-muted/80",
    }

    const containerRef = React.useRef<HTMLDivElement>(null)

    // Responsive mobile detection
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
      const checkMobile = () => {
        const winMobile = typeof window !== "undefined" && window.innerWidth < 768
        const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 0
        const containerMobile = containerWidth > 0 && containerWidth < 768
        setIsMobile(winMobile || containerMobile)
      }

      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Active section state for mobile tabs mode
    const [internalActiveId, setInternalActiveId] = React.useState<string>(
      sections[0]?.id ?? ""
    )

    React.useEffect(() => {
      if (sections.length > 0 && !sections.some((s) => s.id === internalActiveId)) {
        setInternalActiveId(sections[0].id)
      }
    }, [sections, internalActiveId])

    const currentActiveId =
      (activeSectionId && sections.some((s) => s.id === activeSectionId)
        ? activeSectionId
        : undefined) ??
      (sections.some((s) => s.id === internalActiveId)
        ? internalActiveId
        : (sections[0]?.id ?? ""))

    const handleTabChange = React.useCallback(
      (newId: string) => {
        setInternalActiveId(newId)
        onActiveSectionChange?.(newId)
      },
      [onActiveSectionChange]
    )

    // Compute default sizes (server-safe — no localStorage access)
    const defaultSizes = React.useMemo(() => {
      const raw = sections.map((section) => section.defaultSize ?? 100 / sections.length)
      const total = raw.reduce((sum, size) => sum + size, 0)
      return raw.map((size) => (size / total) * 100)
    }, [sections])

    const [sizes, setSizes] = React.useState<number[]>(defaultSizes)

    // Sync sizes if the number of sections changes (e.g. data loads and new section appears)
    const prevSectionsLengthRef = React.useRef(sections.length)
    React.useEffect(() => {
      if (prevSectionsLengthRef.current !== sections.length) {
        prevSectionsLengthRef.current = sections.length
        setSizes(defaultSizes)
      }
    }, [sections.length, defaultSizes])

    // After hydration, overwrite with persisted sizes if available
    React.useEffect(() => {
      if (!storageKey) return
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      try {
        const parsed: number[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === sections.length) {
          setSizes(parsed)
        }
      } catch {
        // ignore malformed storage
      }
    }, [storageKey, sections.length])

    const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null)
    const [startX, setStartX] = React.useState(0)
    const [startSizes, setStartSizes] = React.useState<number[]>([])
    const [containerSize, setContainerSize] = React.useState(0)

    // Update container size on mount and resize
    React.useEffect(() => {
      const updateContainerSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const size = orientation === "horizontal" ? rect.width : rect.height
          setContainerSize(size)
        }
      }

      updateContainerSize()
      window.addEventListener("resize", updateContainerSize)
      return () => window.removeEventListener("resize", updateContainerSize)
    }, [orientation])

    // Save to localStorage when sizes change (only in browser)
    React.useEffect(() => {
      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(sizes))
      }
    }, [sizes, storageKey])

    const handleMouseDown = React.useCallback(
      (index: number, e: React.MouseEvent) => {
        e.preventDefault()
        setDraggingIndex(index)
        setStartX(orientation === "horizontal" ? e.clientX : e.clientY)
        setStartSizes([...sizes])
      },
      [sizes, orientation]
    )

    const handleTouchStart = React.useCallback(
      (index: number, e: React.TouchEvent) => {
        if (e.touches.length !== 1) return
        setDraggingIndex(index)
        setStartX(orientation === "horizontal" ? e.touches[0].clientX : e.touches[0].clientY)
        setStartSizes([...sizes])
      },
      [sizes, orientation]
    )

    const applyDelta = React.useCallback(
      (deltaPixels: number) => {
        if (draggingIndex === null || containerSize === 0) return

        const deltaPercent = (deltaPixels / containerSize) * 100

        const p1 = sections[draggingIndex]
        const p2 = sections[draggingIndex + 1]

        const p1Start = startSizes[draggingIndex]
        const p2Start = startSizes[draggingIndex + 1]

        const p1Min = p1.minSize ?? 10
        const p1Max = p1.maxSize ?? 80
        const p2Min = p2.minSize ?? 10
        const p2Max = p2.maxSize ?? 80

        // Calculate how much we can actually change panel 1
        const maxPositiveDelta = Math.max(
          0,
          Math.min(
            p1Max - p1Start, // Space p1 has to grow
            p2Start - p2Min // Space p2 has to shrink
          )
        )

        const maxNegativeDelta = Math.min(
          0,
          Math.max(
            p1Min - p1Start, // Space p1 has to shrink (negative)
            p2Start - p2Max // Space p2 has to grow (negative)
          )
        )

        // Clamp the delta
        let clampedDelta = deltaPercent
        if (clampedDelta > 0) {
          clampedDelta = Math.min(clampedDelta, maxPositiveDelta)
        } else {
          clampedDelta = Math.max(clampedDelta, maxNegativeDelta)
        }

        const newSizes = [...startSizes]
        newSizes[draggingIndex] = p1Start + clampedDelta
        newSizes[draggingIndex + 1] = p2Start - clampedDelta

        // Normalize to 100% just in case of floating point drift
        const total = newSizes.reduce((sum, size) => sum + size, 0)
        const normalizedSizes = newSizes.map((size) => (size / total) * 100)

        setSizes(normalizedSizes)

        // Notify parent
        if (onSectionResize) {
          onSectionResize(sections[draggingIndex].id, normalizedSizes[draggingIndex])
          onSectionResize(sections[draggingIndex + 1].id, normalizedSizes[draggingIndex + 1])
        }
      },
      [draggingIndex, containerSize, sections, startSizes, onSectionResize]
    )

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        const currentPos = orientation === "horizontal" ? e.clientX : e.clientY
        applyDelta(currentPos - startX)
      },
      [orientation, startX, applyDelta]
    )

    const handleTouchMove = React.useCallback(
      (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const currentPos = orientation === "horizontal" ? e.touches[0].clientX : e.touches[0].clientY
        applyDelta(currentPos - startX)
      },
      [orientation, startX, applyDelta]
    )

    const handleEnd = React.useCallback(() => {
      setDraggingIndex(null)
    }, [])

    React.useEffect(() => {
      if (draggingIndex !== null) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleEnd)
        document.addEventListener("touchmove", handleTouchMove, { passive: false })
        document.addEventListener("touchend", handleEnd)
        return () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleEnd)
          document.removeEventListener("touchmove", handleTouchMove)
          document.removeEventListener("touchend", handleEnd)
        }
      }
    }, [draggingIndex, handleMouseMove, handleTouchMove, handleEnd])

    const renderPanel = (section: AdjustableLayoutSection, size: number, index: number) => {
      const nextSection = sections[index + 1]
      const isResizable =
        section.resizable !== false &&
        sections.length > 1 &&
        index < sections.length - 1 &&
        !section.fixedSize &&
        !nextSection?.fixedSize

      const fixedStyle = section.fixedSize
        ? orientation === "horizontal"
          ? { flex: `0 0 ${section.fixedSize}`, width: section.fixedSize, minWidth: section.fixedSize }
          : { flex: `0 0 ${section.fixedSize}`, height: section.fixedSize, minHeight: section.fixedSize }
        : null

      return (
        <React.Fragment key={section.id}>
          <div
            className={cn(
              "min-h-0 overflow-hidden",
              (section.variant ?? "default") === "default" && "bg-card border border-border rounded-xl",
              section.className
            )}
            style={{
              ...(fixedStyle ?? { flex: `${size} 1 0%` }),
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {section.content}
          </div>

          {index < sections.length - 1 && (
            isResizable ? (
              <div
                className={cn(
                  "flex-shrink-0 flex items-center justify-center relative group touch-none select-none",
                  orientation === "vertical"
                    ? "cursor-row-resize h-2 w-full"
                    : "cursor-col-resize w-2 h-full"
                )}
                onMouseDown={(e) => handleMouseDown(index, e)}
                onTouchStart={(e) => handleTouchStart(index, e)}
              >
                {/* Visible pill */}
                <div
                  className={cn(
                    `${colorMap[dragHandleColor]} transition-colors duration-200 rounded-full`,
                    orientation === "vertical" ? "h-1 w-8" : "w-1 h-8"
                  )}
                />
                {/* Invisible large hit area */}
                <div
                  className={cn(
                    "absolute z-10",
                    orientation === "vertical"
                      ? "inset-x-0 -top-2 -bottom-2"
                      : "inset-y-0 -left-2 -right-2"
                  )}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex-shrink-0",
                  orientation === "vertical" ? "h-2 w-full" : "w-2 h-full"
                )}
              />
            )
          )}
        </React.Fragment>
      )
    }

    const isMobileMode = isMobile && mobileBehavior !== "none"

    if (isMobileMode && mobileBehavior === "tabs") {
      return (
        <div
          ref={containerRef}
          className={cn(
            "flex flex-col overflow-hidden h-full min-w-0 w-full",
            padded && (!hideMobileTabs ? "p-2 sm:p-4 gap-2" : "p-2 sm:p-4"),
            className
          )}
          {...props}
        >
          {sections.length > 1 && !hideMobileTabs && (
            <div className="flex-none pb-1">
              <Tabs
                value={currentActiveId}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList
                  className="grid w-full h-9 bg-muted/60 p-1 rounded-lg"
                  style={{
                    gridTemplateColumns: `repeat(${sections.length}, minmax(0, 1fr))`,
                  }}
                >
                  {sections.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="text-xs sm:text-sm font-medium truncate px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                    >
                      {section.label || section.title || formatSectionTitle(section.id)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          <div className="flex-1 min-h-0 relative overflow-hidden">
            {sections.map((section) => {
              const isActive = section.id === currentActiveId
              return (
                <div
                  key={section.id}
                  className={cn(
                    "h-full w-full min-h-0 overflow-hidden",
                    !isActive && "hidden",
                    (section.variant ?? "default") === "default" &&
                      "bg-card border border-border rounded-xl",
                    section.className
                  )}
                >
                  {section.content}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    if (isMobileMode && mobileBehavior === "stack") {
      return (
        <div
          ref={containerRef}
          className={cn(
            "flex flex-col overflow-y-auto h-full gap-2 min-w-0 w-full",
            padded && "p-2 sm:p-4",
            className
          )}
          {...props}
        >
          {sections.map((section) => (
            <div
              key={section.id}
              className={cn(
                "min-h-[200px] overflow-hidden w-full flex-shrink-0",
                (section.variant ?? "default") === "default" &&
                  "bg-card border border-border rounded-xl",
                section.className
              )}
            >
              {section.content}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex overflow-hidden h-full gap-1 min-w-0",
          padded && "p-4",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      >
        {sections.map((section, index) =>
          renderPanel(section, sizes[index], index)
        )}
      </div>
    )
  }
)

AdjustableLayout.displayName = "AdjustableLayout"
