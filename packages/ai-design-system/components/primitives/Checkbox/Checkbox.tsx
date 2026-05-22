import * as React from "react"
import { Checkbox as ShadcnCheckbox } from "../../ui/checkbox"

/**
 * Checkbox Primitive
 *
 * A checkbox input component with support for checked, unchecked, and indeterminate states.
 * Built on Radix UI Checkbox primitive with WCAG 2.1 Level AA compliance.
 *
 * @see https://ui.shadcn.com/docs/components/checkbox
 * @see https://www.radix-ui.com/primitives/docs/components/checkbox
 */

export type CheckboxProps = React.ComponentProps<typeof ShadcnCheckbox>

/**
 * Checkbox component
 *
 * A checkbox input component with support for checked, unchecked, and indeterminate states.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Three states: checked, unchecked, indeterminate
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * - Dark mode support
 * - Accessible label association
 */
export const Checkbox = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnCheckbox>,
    CheckboxProps
  >((props, ref) => {
    return <ShadcnCheckbox ref={ref} {...props} />
  })
)

Checkbox.displayName = "Checkbox"
