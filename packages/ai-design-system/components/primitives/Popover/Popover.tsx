import * as React from "react"
import {
  Popover as ShadcnPopover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"

/**
 * Popover Primitive
 *
 * A foundational popover component that wraps shadcn/ui Popover with extensibility for
 * design system-specific enhancements. This primitive provides accessible floating content
 * that appears near a trigger element or anchor point.
 *
 * Built on Radix UI Popover primitive with WCAG 2.1 Level AA compliance:
 * - Proper focus management
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Portal rendering for proper layering
 * - Flexible positioning
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Open Popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <div>Popover content</div>
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * @example With anchor positioning
 * ```tsx
 * <Popover>
 *   <PopoverAnchor asChild>
 *     <div ref={anchorRef}>Anchor element</div>
 *   </PopoverAnchor>
 *   <PopoverContent>
 *     <div>Positioned near anchor</div>
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/popover - shadcn/ui Popover documentation
 * @see https://www.radix-ui.com/primitives/docs/components/popover - Radix UI Popover primitive
 */

/**
 * Popover Root component props
 * Controls the open state and positioning behavior
 */
export type PopoverProps = React.ComponentProps<typeof ShadcnPopover>

/**
 * PopoverContent component props
 * Main content container with positioning options
 */
export type PopoverContentProps = React.ComponentProps<typeof PopoverContent>

/**
 * PopoverTrigger component props
 * Element that opens the popover
 */
export type PopoverTriggerProps = React.ComponentProps<typeof PopoverTrigger>

/**
 * PopoverAnchor component props
 * Element to position the popover near (alternative to trigger)
 */
export type PopoverAnchorProps = React.ComponentProps<typeof PopoverAnchor>

/**
 * Popover component
 *
 * A popover component built on Radix UI Popover primitive.
 * Provides accessible floating content with flexible positioning.
 *
 * Features:
 * - Focus management
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Portal rendering for proper layering
 * - Flexible positioning (top, right, bottom, left)
 * - Anchor-based positioning
 * - Dark mode support
 */
export const Popover = React.forwardRef<
  React.ElementRef<typeof ShadcnPopover>,
  PopoverProps
>((props, ref) => {
  return <ShadcnPopover {...props} />
})

Popover.displayName = "Popover"

/**
 * Re-export all Popover sub-components for composition
 *
 * These components should be used together to build complete popover experiences:
 * - PopoverTrigger: Opens the popover (optional if using anchor)
 * - PopoverAnchor: Element to position near (alternative to trigger)
 * - PopoverContent: Main content container with positioning
 */
export { PopoverAnchor, PopoverContent, PopoverTrigger }
