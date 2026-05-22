import * as React from "react"
import { Label as ShadcnLabel } from "../../ui/label"

/**
 * Label Primitive
 *
 * A foundational label component that wraps shadcn/ui Label with design system
 * enhancements. This primitive serves as the single source of truth for all form
 * labels across the application.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 *
 * <Label htmlFor="terms">
 *   Accept terms and conditions
 * </Label>
 * <Checkbox id="terms" />
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/label - shadcn/ui Label documentation
 */

/**
 * Label component props
 * Extends the native label element props
 */
export type LabelProps = React.ComponentPropsWithoutRef<typeof ShadcnLabel>

/**
 * Label component
 *
 * An accessible label component for form inputs, built on shadcn/ui foundation.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Semantic HTML label element
 * - Proper association with form controls via htmlFor
 * - Consistent typography and spacing
 * - Dark mode support
 * - Disabled state styling via peer selectors
 */
export const Label = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnLabel>,
    LabelProps
  >((props, ref) => {
    return <ShadcnLabel ref={ref} {...props} />
  })
)

Label.displayName = "Label"
