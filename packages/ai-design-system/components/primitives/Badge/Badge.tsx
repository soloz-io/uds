import * as React from "react"
import { Badge as ShadcnBadge, badgeVariants } from "../../ui/badge"
import type { VariantProps } from "class-variance-authority"

/**
 * Badge Primitive
 *
 * A small status indicator component for labels, counts, and status.
 * Built with CVA for variant management.
 *
 * @see https://ui.shadcn.com/docs/components/badge
 */

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }

/**
 * Badge component
 *
 * A small status indicator component for labels, counts, and status.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Multiple variants for different contexts (default, secondary, destructive, outline)
 * - Flexible sizing and composition
 * - Dark mode support
 * - Can be rendered as a child element using asChild prop
 */
export const Badge = React.memo(
  React.forwardRef<HTMLSpanElement, BadgeProps>(
    (props, ref) => {
      return <ShadcnBadge ref={ref} {...props} />
    }
  )
)

Badge.displayName = "Badge"

/**
 * Re-export badgeVariants for consumers who need direct access to the variant generator.
 */
export { badgeVariants }

/**
 * Re-export VariantProps for type inference in consuming components
 */
export type { VariantProps }
