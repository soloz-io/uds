import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"
import { Button } from "../Button"
import { Input } from "../Input"

/**
 * Dialog Primitive Stories
 *
 * The Dialog component provides an accessible modal overlay for focused user interactions.
 * It's built on Radix UI Dialog primitive with comprehensive keyboard and screen reader support.
 *
 * ## Accessibility Features
 * - Focus is trapped within the dialog when open
 * - Focus returns to trigger element on close
 * - Escape key closes the dialog
 * - Screen reader announces dialog content
 * - Proper ARIA attributes (role="dialog", aria-labelledby, aria-describedby)
 *
 * ## Usage Guidelines
 * - Always include DialogTitle for accessibility (screen readers)
 * - Use DialogDescription for additional context
 * - Keep dialog content focused and concise
 * - Provide clear action buttons in DialogFooter
 * - Use for critical actions, confirmations, or complex forms
 *
 * ## When to Use
 * - Collecting user input in a focused context
 * - Displaying important information that requires user acknowledgment
 * - Confirming destructive or important actions
 * - Multi-step workflows that need isolation
 *
 * ## When NOT to Use
 * - For simple notifications (use Toast or Alert instead)
 * - For irreversible destructive actions (use AlertDialog instead)
 * - For non-blocking information (use Popover or Tooltip instead)
 */
const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog component with accessible focus management and keyboard navigation. Built on Radix UI Dialog primitive.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Dialog
 *
 * Basic dialog with title, description, and action buttons.
 * This is the most common dialog pattern.
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description that provides additional context about the
            dialog's purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            Dialog body content goes here. You can include any components or
            information needed for this interaction.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Form Dialog
 *
 * Dialog containing a form with input fields.
 * Useful for collecting structured user input.
 */
export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Enter your details to create a new account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Confirmation Dialog
 *
 * Dialog for confirming user actions.
 * Use clear action verbs in button labels.
 */
export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Save Changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will save all your changes and update the document.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Your changes will be saved permanently and cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * No Close Button Dialog
 *
 * Dialog without the close button in the top-right corner.
 * Forces user to use explicit action buttons.
 */
export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Action Required</DialogTitle>
          <DialogDescription>
            Please make a selection to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            This dialog requires you to make an explicit choice using the
            buttons below.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Scrollable Content Dialog
 *
 * Dialog with long content that requires scrolling.
 * Content area automatically scrolls while header and footer remain fixed.
 */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto py-4 max-h-[50vh]">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-sm mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Custom Width Dialog
 *
 * Dialog with custom width using className override.
 * Default max-width is 'sm:max-w-lg'.
 */
export const CustomWidth: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Wide Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Wide Dialog</DialogTitle>
          <DialogDescription>
            This dialog has a custom width to accommodate wider content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            You can customize the dialog width by passing a className with
            max-width utilities. This example uses 'sm:max-w-3xl'.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Controlled Dialog
 *
 * Dialog with controlled open state using React state.
 * Useful when you need to programmatically control the dialog.
 */
export const ControlledDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open Dialog</Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={!open}
          >
            Close Externally
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog's open state is controlled by React state.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">
                You can control this dialog programmatically using the external
                buttons.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
}

/**
 * Dark Mode Dialog
 *
 * Dialog appearance in dark mode.
 * All dialog styles are theme-aware and adapt to dark mode automatically.
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dark Mode Dialog</DialogTitle>
            <DialogDescription>
              This dialog automatically adapts to dark mode.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              All colors and contrast ratios are optimized for dark mode,
              ensuring WCAG 2.1 Level AA compliance.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}
