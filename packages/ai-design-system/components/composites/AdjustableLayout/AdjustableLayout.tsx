import * as React from "react"
import { cn } from "@/lib/utils"

export interface AdjustableLayoutSection {
  id: string
  content: React.ReactNode
  defaultSize?: number // percentage (0-100)
  minSize?: number // minimum percentage
  maxSize?: number // maximum percentage
  resizable?: boolean // default true for >1 sections
  className?: string
}

export interface AdjustableLayoutProps extends React.ComponentPropsWithoutRef<"div"> {
  sections: AdjustableLayoutSection[]
  orientation?: "horizontal" | "vertical"
  storageKey?: string // localStorage key for persistence
  onSectionResize?: (sectionId: string, newSize: number) => void
  dragHandleColor?: "primary" | "secondary" | "accent" | "border" | "muted"
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
      const newSizes = [...startSizes]
      
      // Adjust sizes of adjacent panels
      newSizes[draggingIndex] = Math.max(
        sections[draggingIndex].minSize ?? 10,
        Math.min(
          sections[draggingIndex].maxSize ?? 80,
          startSizes[draggingIndex] + deltaPercent
        )
      )
      
      newSizes[draggingIndex + 1] = Math.max(
        sections[draggingIndex + 1].minSize ?? 10,
        Math.min(
          sections[draggingIndex + 1].maxSize ?? 80,
          startSizes[draggingIndex + 1] - deltaPercent
        )
      )
      
      // Normalize to 100%
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
      // Drag handles should be between panels, so only show for panels that aren't the last one
      const isResizable = section.resizable !== false && sections.length > 1 && index < sections.length - 1
      
      return (
        <React.Fragment key={section.id}>
          <div
            className={cn(
              "h-full overflow-hidden bg-card border border-border rounded-md",
              section.className
            )}
            style={{
              flex: `${size} 1 0%`,
              minWidth: 0,
            }}
          >
            {section.content}
          </div>
          
          {/* Show drag handle after this panel if it's not the last one */}
          {isResizable && (
            <div
              className={cn(
                `${colorMap[dragHandleColor]} flex-shrink-0 transition-colors duration-200 relative group`,
                orientation === "vertical" 
                  ? "cursor-row-resize h-1 w-full" 
                  : "cursor-col-resize w-1 h-full"
              )}
              onMouseDown={(e) => handleMouseDown(index, e)}
            >
              <div 
                className={cn(
                  `absolute inset-0 ${hoverColorMap[dragHandleColor]}`,
                  orientation === "vertical" 
                    ? "h-3 -translate-y-1" 
                    : "w-3 -translate-x-1"
                )} 
              />
            </div>
          )}
        </React.Fragment>
      )
    }

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex overflow-hidden h-full gap-1 min-w-0",
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
