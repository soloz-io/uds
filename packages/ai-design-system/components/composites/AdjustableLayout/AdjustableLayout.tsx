import * as React from "react"
import { cn } from "@/lib/utils"

export interface AdjustableLayoutSection {
  id: string
  content: React.ReactNode
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
    ...props
  }) => {
    // Color mapping for drag handles
    const colorMap = {
      primary: "bg-primary hover:bg-primary/90",
      secondary: "bg-secondary hover:bg-secondary/80",
      accent: "bg-accent hover:bg-accent/80",
      border: "bg-border hover:bg-border/80",
      muted: "bg-muted hover:bg-muted/80"
    }

    const hoverColorMap = {
      primary: "group-hover:bg-primary/30",
      secondary: "group-hover:bg-secondary/30",
      accent: "group-hover:bg-accent/30",
      border: "group-hover:bg-border/30",
      muted: "group-hover:bg-muted/30"
    }
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Compute default sizes (server-safe — no localStorage access)
    const defaultSizes = React.useMemo(() => {
      const raw = sections.map(section => section.defaultSize ?? (100 / sections.length))
      const total = raw.reduce((sum, size) => sum + size, 0)
      return raw.map(size => (size / total) * 100)
    }, [sections])

    const [sizes, setSizes] = React.useState<number[]>(defaultSizes)

    // Sync sizes if the number of sections changes (e.g. data loads and new section appears)
    React.useEffect(() => {
      setSizes((prevSizes) => {
        if (prevSizes.length !== sections.length) {
          return defaultSizes;
        }
        return prevSizes;
      });
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey])

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
      window.addEventListener('resize', updateContainerSize)
      return () => window.removeEventListener('resize', updateContainerSize)
    }, [orientation])

    // Save to localStorage when sizes change (only in browser)
    React.useEffect(() => {
      if (storageKey && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(sizes))
      }
    }, [sizes, storageKey])

    const handleMouseDown = React.useCallback((index: number, e: React.MouseEvent) => {
      e.preventDefault()
      setDraggingIndex(index)
      setStartX(orientation === "horizontal" ? e.clientX : e.clientY)
      setStartSizes([...sizes])
    }, [sizes, orientation])

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
      if (draggingIndex === null || containerSize === 0) return

      const currentX = orientation === "horizontal" ? e.clientX : e.clientY
      const deltaX = currentX - startX

      const deltaPercent = (deltaX / containerSize) * 100

      const p1 = sections[draggingIndex]
      const p2 = sections[draggingIndex + 1]

      const p1Start = startSizes[draggingIndex]
      const p2Start = startSizes[draggingIndex + 1]

      const p1Min = p1.minSize ?? 10
      const p1Max = p1.maxSize ?? 80
      const p2Min = p2.minSize ?? 10
      const p2Max = p2.maxSize ?? 80

      // Calculate how much we can actually change panel 1
      // If deltaPercent > 0, we are growing p1 and shrinking p2
      const maxPositiveDelta = Math.max(0, Math.min(
        p1Max - p1Start,       // Space p1 has to grow
        p2Start - p2Min        // Space p2 has to shrink
      ))

      // If deltaPercent < 0, we are shrinking p1 and growing p2
      const maxNegativeDelta = Math.min(0, Math.max(
        p1Min - p1Start,       // Space p1 has to shrink (negative)
        p2Start - p2Max        // Space p2 has to grow (negative)
      ))

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
      const normalizedSizes = newSizes.map(size => (size / total) * 100)

      setSizes(normalizedSizes)

      // Notify parent
      if (onSectionResize) {
        onSectionResize(sections[draggingIndex].id, normalizedSizes[draggingIndex])
        onSectionResize(sections[draggingIndex + 1].id, normalizedSizes[draggingIndex + 1])
      }
    }, [draggingIndex, startX, startSizes, sections, orientation, containerSize, onSectionResize])

    const handleMouseUp = React.useCallback(() => {
      setDraggingIndex(null)
    }, [])

    React.useEffect(() => {
      if (draggingIndex !== null) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
        return () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }
      }
    }, [draggingIndex, handleMouseMove, handleMouseUp])

    const renderPanel = (section: AdjustableLayoutSection, size: number, index: number) => {
      const nextSection = sections[index + 1]
      // Drag handles should be between panels, so only show for panels that aren't the last one
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

          {/* Show drag handle or spacer after this panel if it's not the last one */}
          {index < sections.length - 1 && (
            isResizable ? (
              <div
                className={cn(
                  "flex-shrink-0 flex items-center justify-center relative group",
                  orientation === "vertical"
                    ? "cursor-row-resize h-2 w-full"
                    : "cursor-col-resize w-2 h-full"
                )}
                onMouseDown={(e) => handleMouseDown(index, e)}
              >
                {/* Visible pill */}
                <div
                  className={cn(
                    `${colorMap[dragHandleColor]} transition-colors duration-200 rounded-full`,
                    orientation === "vertical"
                      ? "h-1 w-8"
                      : "w-1 h-8"
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
