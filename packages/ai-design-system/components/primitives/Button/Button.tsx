import * as React from "react"
import {
  Button as ShadcnButton,
  buttonVariants,
} from "../../ui/button"
import type { VariantProps } from "class-variance-authority"

/**
 * Button Primitive
 *
 * A foundational button component that wraps shadcn/ui Button with design system
 * enhancements. This primitive serves as the single source of truth for all button
 * interactions across the application.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="default">
 *   Click me
 * </Button>
 *
 * <Button variant="destructive" size="sm">
 *   Delete
 * </Button>
 *
 * <Button variant="outline" size="lg" asChild>
 *   <Link href="/home">Go Home</Link>
 * </Button>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/button - shadcn/ui Button documentation
 */

/**
 * Button component props
 * Extends the native button element props with variant and size options
 */
export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /**
     * Renders the button as a child element using Radix Slot.
     * Useful for rendering buttons as links or other custom elements.
     * @default false
     */
    asChild?: boolean
  }

/**
 * Button component
 *
 * A versatile button component with multiple variants and sizes, built on shadcn/ui foundation.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Multiple visual variants for different contexts
 * - Flexible sizing options including icon-only buttons
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * - Dark mode support
 * - Composition via asChild prop (Radix Slot)
 */
export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
      return <ShadcnButton ref={ref} {...props} />
    }
  )
)

Button.displayName = "Button"

/**
 * Re-export buttonVariants for consumers who need direct access to the variant generator.
 * This is useful for creating custom button-like components that need consistent styling.
 *
 * @example
 * ```tsx
 * import { buttonVariants } from './Button'
 *
 * <div className={buttonVariants({ variant: "outline", size: "sm" })}>
 *   Custom button-like div
 * </div>
 * ```
 */
export { buttonVariants }

/**
 * Re-export VariantProps for type inference in consuming components
 */
export type { VariantProps }
