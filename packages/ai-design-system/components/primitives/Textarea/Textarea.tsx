import * as React from "react"
import {
  Textarea as ShadcnTextarea,
  textareaVariants,
} from "../../ui/textarea"
import type { VariantProps } from "class-variance-authority"

/**
 * Textarea Primitive
 *
 * A foundational textarea component that wraps shadcn/ui Textarea with design system
 * enhancements. This primitive serves as the single source of truth for all multi-line
 * text input interactions across the application.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Enter your message..." />
 *
 * <Textarea
 *   placeholder="Description"
 *   rows={5}
 *   size="sm"
 * />
 *
 * <Textarea
 *   placeholder="Enter comment"
 *   state="error"
 * />
 *
 * <Textarea
 *   placeholder="Success state"
 *   state="success"
 *   size="lg"
 * />
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/textarea - shadcn/ui Textarea documentation
 */

/**
 * Textarea component props
 * Extends the native textarea element props with variant options
 */
export type TextareaProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants>

/**
 * Textarea component
 *
 * A versatile multi-line text input component built on shadcn/ui foundation.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Full WCAG 2.1 Level AA compliance
 * - Size variants (sm, default, lg) for different contexts
 * - State variants (default, error, success, warning) for visual feedback
 * - Customizable row height
 * - Validation state styling via aria-invalid
 * - Dark mode support
 * - Placeholder and disabled states
 * - Auto-resize capabilities
 */
export const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (props, ref) => {
      return <ShadcnTextarea ref={ref} {...props} />
    }
  )
)

Textarea.displayName = "Textarea"

/**
 * Re-export textareaVariants for consumers who need direct access to the variant generator.
 * This is useful for creating custom textarea-like components that need consistent styling.
 *
 * @example
 * ```tsx
 * import { textareaVariants } from './Textarea'
 *
 * <div className={textareaVariants({ size: "sm", state: "error" })}>
 *   Custom textarea-like div
 * </div>
 * ```
 */
export { textareaVariants }

/**
 * Re-export VariantProps for type inference in consuming components
 */
export type { VariantProps }
