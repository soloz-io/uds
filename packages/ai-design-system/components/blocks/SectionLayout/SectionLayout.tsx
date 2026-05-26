import * as React from "react"
import { AdjustableLayout } from "@/components/composites/AdjustableLayout"
import { AppHeader } from "@/components/composites/AppHeader"
import type { SectionLayoutProps } from "./interfaces"

/**
 * SectionLayout Block
 *
 * A layout block that provides adjustable panels with headers.
 * Uses AdjustableLayout composite for panel management and AppHeader composite for headers.
 * 
 * This is a Block component that composites multiple Composite components
 * to provide higher-level layout functionality.
 */
export const SectionLayout = React.memo<SectionLayoutProps>(
  ({ 
    sections, 
    orientation = "horizontal",
    storageKey,
    onSectionResize,
    dragHandleColor = "border",
    className,
    ...props 
  }) => {
    // Transform sections to include headers
    const transformedSections = sections.map(section => ({
      ...section,
      content: (
        <div className="h-full min-h-0 flex flex-col overflow-hidden">
          {section.header && (
            <AppHeader {...section.header} />
          )}
          <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {section.content}
          </div>
        </div>
      ),
    }))

    return (
      <AdjustableLayout
        sections={transformedSections}
        orientation={orientation}
        storageKey={storageKey}
        onSectionResize={onSectionResize}
        dragHandleColor={dragHandleColor}
        className={className}
        {...props}
      />
    )
  }
)

SectionLayout.displayName = "SectionLayout"
