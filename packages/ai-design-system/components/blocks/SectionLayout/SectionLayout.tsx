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
    resizable = true,
    dragHandleColor = "border",
    className,
    padded = true,
    mobileBehavior = "tabs",
    hideMobileTabs = false,
    activeSectionId,
    onActiveSectionChange,
    ...props 
  }) => {
    // Transform sections to include headers and resolve labels
    const transformedSections = sections.map(section => ({
      ...section,
      resizable,
      label:
        section.label ||
        section.title ||
        (typeof section.header?.title === "string" ? section.header.title : undefined) ||
        section.header?.tabs?.[0]?.label,
      content: (
        <div className="h-full min-h-0 flex flex-col overflow-hidden">
          {section.header && (
            <AppHeader {...section.header} />
          )}
          <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
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
        padded={padded}
        mobileBehavior={mobileBehavior}
        hideMobileTabs={hideMobileTabs}
        activeSectionId={activeSectionId}
        onActiveSectionChange={onActiveSectionChange}
        {...props}
      />
    )
  }
)

SectionLayout.displayName = "SectionLayout"
