import * as React from "react"
import { Separator as ShadcnSeparator } from "../../ui/separator"

/**
 * Separator Primitive
 *
 * A foundational separator component that wraps shadcn/ui Separator with design system
 * enhancements. This primitive serves as the single source of truth for all visual
 * separators across the application.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/separator - shadcn/ui Separator documentation
 */

/**
 * Separator component props
 * Extends the Radix UI Separator props
 */
export type SeparatorProps = React.ComponentPropsWithoutRef<typeof ShadcnSeparator>

/**
 * Separator component
 *
 * A visual separator component for dividing content, built on shadcn/ui foundation.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Semantic HTML with proper ARIA attributes
 * - Consistent styling across the application
 * - Dark mode support
 * - Decorative by default (not announced to screen readers)
 */
export const Separator = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnSeparator>,
    SeparatorProps
  >((props, ref) => {
    return <ShadcnSeparator ref={ref} {...props} />
  })
)

Separator.displayName = "Separator"
