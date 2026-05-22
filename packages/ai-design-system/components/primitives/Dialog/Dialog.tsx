import * as React from "react"
import {
  Dialog as ShadcnDialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"

/**
 * Dialog Primitive
 *
 * A foundational modal dialog component that wraps shadcn/ui Dialog with extensibility for
 * design system-specific enhancements. This primitive provides accessible modal interactions
 * with full keyboard navigation and focus management.
 *
 * Built on Radix UI Dialog primitive with WCAG 2.1 Level AA compliance:
 * - Proper focus trapping and restoration
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Portal rendering for proper layering
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Dialog description text</DialogDescription>
 *     </DialogHeader>
 *     <div>Dialog body content</div>
 *     <DialogFooter>
 *       <Button>Action</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/dialog - shadcn/ui Dialog documentation
 * @see https://www.radix-ui.com/primitives/docs/components/dialog - Radix UI Dialog primitive
 */

/**
 * Dialog Root component props
 * Controls the open state and modal behavior
 */
export type DialogProps = React.ComponentProps<typeof ShadcnDialog>

/**
 * DialogContent component props
 * Main content container with optional close button
 */
export type DialogContentProps = React.ComponentProps<typeof DialogContent>

/**
 * DialogTrigger component props
 * Element that opens the dialog
 */
export type DialogTriggerProps = React.ComponentProps<typeof DialogTrigger>

/**
 * DialogHeader component props
 * Header section for title and description
 */
export type DialogHeaderProps = React.ComponentProps<typeof DialogHeader>

/**
 * DialogFooter component props
 * Footer section for action buttons
 */
export type DialogFooterProps = React.ComponentProps<typeof DialogFooter>

/**
 * DialogTitle component props
 * Accessible title for the dialog
 */
export type DialogTitleProps = React.ComponentProps<typeof DialogTitle>

/**
 * DialogDescription component props
 * Accessible description for the dialog
 */
export type DialogDescriptionProps = React.ComponentProps<typeof DialogDescription>

/**
 * Dialog component
 *
 * A modal dialog component built on Radix UI Dialog primitive.
 * Provides accessible modal interactions with full keyboard navigation.
 *
 * Features:
 * - Focus trapping and restoration
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Portal rendering for proper layering
 * - Overlay dismiss support
 * - Dark mode support
 */
export const Dialog = React.forwardRef<
  React.ElementRef<typeof ShadcnDialog>,
  DialogProps
>((props, ref) => {
  return <ShadcnDialog {...props} />
})

Dialog.displayName = "Dialog"

/**
 * Re-export all Dialog sub-components for composition
 *
 * These components should be used together to build complete dialog experiences:
 * - DialogTrigger: Opens the dialog
 * - DialogContent: Main content container
 * - DialogHeader: Header section with title and description
 * - DialogFooter: Footer section with actions
 * - DialogTitle: Accessible title (required for a11y)
 * - DialogDescription: Accessible description (recommended for a11y)
 * - DialogClose: Explicitly close the dialog (optional, auto close button in DialogContent)
 * - DialogPortal: Advanced portal customization (rarely needed)
 * - DialogOverlay: Advanced overlay customization (rarely needed)
 */
export {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
