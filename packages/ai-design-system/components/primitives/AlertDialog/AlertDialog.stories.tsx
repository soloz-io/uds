import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog"
import { Button } from "../Button"

/**
 * AlertDialog Primitive Stories
 *
 * The AlertDialog component is specifically designed for critical confirmations and
 * destructive actions that require explicit user acknowledgment. Unlike Dialog, AlertDialog
 * enforces a more restrictive interaction model.
 *
 * ## Accessibility Features
 * - Focus is trapped within the alert dialog
 * - Screen reader announces with alert role
 * - Escape key triggers cancel action
 * - No overlay dismiss (requires explicit choice)
 * - Clear distinction between cancel and action buttons
 * - Proper ARIA attributes (role="alertdialog")
 *
 * ## Usage Guidelines
 * - Use for irreversible or destructive actions
 * - Always provide both Cancel and Action buttons
 * - Use clear, action-oriented button labels
 * - Explain consequences in the description
 * - Keep title short and direct (question format works well)
 *
 * ## When to Use
 * - Confirming destructive actions (delete, remove, disable)
 * - Warning about irreversible changes
 * - Critical security confirmations
 * - Data loss warnings
 *
 * ## When NOT to Use
 * - For non-critical confirmations (use Dialog instead)
 * - For collecting input (use Dialog instead)
 * - For informational messages (use Toast or Alert instead)
 * - For dismissible notifications
 */
const meta = {
  title: "Primitives/AlertDialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A critical confirmation dialog for destructive or irreversible actions. Built on Radix UI AlertDialog primitive.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default AlertDialog
 *
 * Basic alert dialog with warning message and confirmation buttons.
 * This is the standard pattern for destructive actions.
 */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete Account</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Destructive Action
 *
 * Alert dialog for confirming a destructive action with clear consequences.
 * Uses destructive variant for the action button.
 */
export const DestructiveAction: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete File</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this file?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "document.pdf" from your workspace.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete File
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Data Loss Warning
 *
 * Alert dialog warning about potential data loss.
 * Emphasizes the consequences of the action.
 */
export const DataLossWarning: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Discard Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost. Are you sure you want
            to discard them?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Editing</AlertDialogCancel>
          <AlertDialogAction>Discard Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Permission Request
 *
 * Alert dialog requesting user permission for sensitive operations.
 * Action button uses default styling for non-destructive confirmations.
 */
export const PermissionRequest: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Request Access</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Allow access to your camera?</AlertDialogTitle>
          <AlertDialogDescription>
            This application needs access to your camera to capture photos.
            You can revoke this permission at any time in settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Deny</AlertDialogCancel>
          <AlertDialogAction>Allow Access</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Multiple Consequences
 *
 * Alert dialog listing multiple consequences of an action.
 * Uses a list to clearly communicate all impacts.
 */
export const MultipleConsequences: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deactivate Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
          <AlertDialogDescription>
            Deactivating your account will have the following effects:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="list-disc list-inside text-sm space-y-1 py-4">
          <li>Your profile will no longer be visible</li>
          <li>Active subscriptions will be cancelled</li>
          <li>Saved content will be deleted after 30 days</li>
          <li>You can reactivate within 30 days</li>
        </ul>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Deactivate Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Controlled AlertDialog
 *
 * Alert dialog with controlled open state using React state.
 * Useful for programmatic control or async confirmation handling.
 */
export const ControlledAlertDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleConfirm = async () => {
      setLoading(true)
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
      setOpen(false)
    }

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Item
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleConfirm()
                }}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  },
}

/**
 * Security Confirmation
 *
 * Alert dialog for critical security actions.
 * Emphasizes the security implications of the action.
 */
export const SecurityConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Revoke API Key</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately invalidate the API key. Any applications
            using this key will lose access. Generate a new key if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Revoke Key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Custom Button Labels
 *
 * Alert dialog with action-specific button labels instead of generic "Cancel/Confirm".
 * Always use clear, descriptive action verbs.
 */
export const CustomButtonLabels: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Leave Team</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this team?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to all team projects and resources. A team
            admin can re-invite you later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay in Team</AlertDialogCancel>
          <AlertDialogAction>Leave Team</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Dark Mode AlertDialog
 *
 * Alert dialog appearance in dark mode.
 * All styles are theme-aware and maintain proper contrast in dark mode.
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
}
