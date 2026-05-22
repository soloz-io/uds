import * as React from "react"
import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog"

/**
 * AlertDialog Primitive
 *
 * A foundational alert dialog component for critical user confirmations and destructive actions.
 * This primitive wraps shadcn/ui AlertDialog with extensibility for design system-specific
 * enhancements.
 *
 * Built on Radix UI AlertDialog primitive with WCAG 2.1 Level AA compliance:
 * - Focus trapping and restoration
 * - Keyboard navigation (Escape to cancel)
 * - Screen reader announcements with alert role
 * - Forced interaction (no overlay dismiss by default)
 * - Clear action/cancel distinction
 *
 * ## Key Differences from Dialog
 * - AlertDialog is specifically for critical confirmations
 * - Users must explicitly choose an action (Cancel or Action)
 * - No close button in corner (forces explicit choice)
 * - More restrictive interaction model
 * - Semantic alert role for screen readers
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">Delete Account</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This action cannot be undone. This will permanently delete your
 *         account and remove your data from our servers.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Delete Account</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/alert-dialog - shadcn/ui AlertDialog documentation
 * @see https://www.radix-ui.com/primitives/docs/components/alert-dialog - Radix UI AlertDialog primitive
 */

/**
 * AlertDialog Root component props
 * Controls the open state and alert behavior
 */
export type AlertDialogProps = React.ComponentProps<typeof ShadcnAlertDialog>

/**
 * AlertDialogContent component props
 * Main content container for alert dialog
 */
export type AlertDialogContentProps = React.ComponentProps<
  typeof AlertDialogContent
>

/**
 * AlertDialogTrigger component props
 * Element that opens the alert dialog
 */
export type AlertDialogTriggerProps = React.ComponentProps<
  typeof AlertDialogTrigger
>

/**
 * AlertDialogHeader component props
 * Header section for title and description
 */
export type AlertDialogHeaderProps = React.ComponentProps<
  typeof AlertDialogHeader
>

/**
 * AlertDialogFooter component props
 * Footer section with cancel and action buttons
 */
export type AlertDialogFooterProps = React.ComponentProps<
  typeof AlertDialogFooter
>

/**
 * AlertDialogTitle component props
 * Accessible title for the alert dialog (required)
 */
export type AlertDialogTitleProps = React.ComponentProps<
  typeof AlertDialogTitle
>

/**
 * AlertDialogDescription component props
 * Accessible description for the alert dialog (required)
 */
export type AlertDialogDescriptionProps = React.ComponentProps<
  typeof AlertDialogDescription
>

/**
 * AlertDialogAction component props
 * Primary action button (typically destructive or confirming)
 */
export type AlertDialogActionProps = React.ComponentProps<
  typeof AlertDialogAction
>

/**
 * AlertDialogCancel component props
 * Cancel button to dismiss the alert
 */
export type AlertDialogCancelProps = React.ComponentProps<
  typeof AlertDialogCancel
>

/**
 * AlertDialog component
 *
 * A modal dialog for critical user confirmations and destructive actions.
 * Built on Radix UI AlertDialog primitive with strict interaction requirements.
 *
 * Features:
 * - Focus trapping and restoration
 * - Keyboard navigation (Escape to cancel)
 * - Screen reader announcements with alert role
 * - Forced interaction (no overlay dismiss)
 * - Clear action/cancel distinction
 * - Dark mode support
 */
export const AlertDialog = React.forwardRef<
  React.ElementRef<typeof ShadcnAlertDialog>,
  AlertDialogProps
>((props, ref) => {
  return <ShadcnAlertDialog {...props} />
})

AlertDialog.displayName = "AlertDialog"

/**
 * Re-export all AlertDialog sub-components for composition
 *
 * These components should be used together to build complete alert dialog experiences:
 * - AlertDialogTrigger: Opens the alert dialog
 * - AlertDialogContent: Main content container
 * - AlertDialogHeader: Header section with title and description
 * - AlertDialogFooter: Footer section with cancel and action buttons
 * - AlertDialogTitle: Accessible title (required for a11y)
 * - AlertDialogDescription: Accessible description (required for a11y)
 * - AlertDialogAction: Primary action button (closes dialog on click)
 * - AlertDialogCancel: Cancel button (closes dialog on click)
 * - AlertDialogPortal: Advanced portal customization (rarely needed)
 * - AlertDialogOverlay: Advanced overlay customization (rarely needed)
 */
export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
