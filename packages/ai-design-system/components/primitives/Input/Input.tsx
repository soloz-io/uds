import * as React from "react"
import {
  Input as ShadcnInput,
  inputVariants,
} from "../../ui/input"
import type { VariantProps } from "class-variance-authority"

/**
 * Input Primitive
 *
 * A foundational input component that wraps shadcn/ui Input with design system
 * enhancements. This primitive serves as the single source of truth for all text
 * input interactions across the application.
 *
 * @example
 * ```tsx
 * <Input type="text" placeholder="Enter your name" />
 *
 * <Input type="email" placeholder="email@example.com" size="sm" />
 *
 * <Input
 *   type="password"
 *   placeholder="Enter password"
 *   state="error"
 * />
 *
 * <Input
 *   type="text"
 *   placeholder="Success state"
 *   state="success"
 *   size="lg"
 * />
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/input - shadcn/ui Input documentation
 */

/**
 * Input component props
 * Extends the native input element props with variant options
 */
export type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>

/**
 * Input component
 *
 * A versatile input component built on shadcn/ui foundation with full accessibility support.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Full WCAG 2.1 Level AA compliance
 * - Support for all native input types
 * - Size variants (sm, default, lg) for different contexts
 * - State variants (default, error, success, warning) for visual feedback
 * - Validation state styling via aria-invalid
 * - Dark mode support
 * - Placeholder and disabled states
 */
export const Input = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
      return <ShadcnInput ref={ref} {...props} />
    }
  )
)

Input.displayName = "Input"

/**
 * Re-export inputVariants for consumers who need direct access to the variant generator.
 * This is useful for creating custom input-like components that need consistent styling.
 *
 * @example
 * ```tsx
 * import { inputVariants } from './Input'
 *
 * <div className={inputVariants({ size: "sm", state: "error" })}>
 *   Custom input-like div
 * </div>
 * ```
 */
export { inputVariants }

/**
 * Re-export VariantProps for type inference in consuming components
 */
export type { VariantProps }
