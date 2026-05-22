import * as React from "react"
import {
  ToggleGroup as ShadcnToggleGroup,
  ToggleGroupItem,
} from "../../ui/toggle-group"
import { toggleVariants } from "../../ui/toggle"
import type { VariantProps } from "class-variance-authority"

/**
 * ToggleGroup Primitive
 *
 * A set of two-state toggle buttons that can work independently or as radio group.
 * Built on Radix UI ToggleGroup primitive with WCAG 2.1 Level AA compliance.
 *
 * @see https://ui.shadcn.com/docs/components/toggle-group
 * @see https://www.radix-ui.com/primitives/docs/components/toggle-group
 */

export type ToggleGroupProps = React.ComponentProps<typeof ShadcnToggleGroup> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }

export type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupItem> &
  VariantProps<typeof toggleVariants>

/**
 * ToggleGroup component
 *
 * A set of two-state toggle buttons that can work independently or as a radio group.
 * Built on Radix UI ToggleGroup primitive with full accessibility support.
 *
 * Features:
 * - Single or multiple selection modes
 * - Keyboard navigation
 * - ARIA attributes
 * - Multiple visual variants
 * - Dark mode support
 */
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ShadcnToggleGroup>,
  ToggleGroupProps
>((props, ref) => {
  return <ShadcnToggleGroup {...props} />
})

ToggleGroup.displayName = "ToggleGroup"

/**
 * Re-export ToggleGroupItem for composition
 */
export { ToggleGroupItem }
