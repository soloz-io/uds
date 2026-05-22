import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

/**
 * Alert component displays important messages to users.
 *
 * ## Features
 * - Variant support (default, destructive)
 * - Optional icon support
 * - Title and description sections
 * - Semantic HTML with role="alert"
 * - Screen reader accessible
 * - WCAG 2.1 Level AA compliant
 *
 * ## Usage
 * ```tsx
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     You can add components to your app using the cli.
 *   </AlertDescription>
 * </Alert>
 * ```
 *
 * ## Accessibility
 * - Uses role="alert" for screen readers
 * - Proper semantic structure
 * - Color is not the only indicator (uses icons and text)
 */
const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays a callout for user attention.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

/**
 * Default alert
 */
export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive variant for errors
 */
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with icon
 */
export const WithIcon: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert with icon
 */
export const DestructiveWithIcon: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to upload file. Please check your internet connection and try again.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Title only
 */
export const TitleOnly: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Update available</AlertTitle>
    </Alert>
  ),
};

/**
 * Description only
 */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertDescription>
        This is a simple alert without a title.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Different alert types with icons
 */
export const AlertTypes: Story = {
  render: () => (
    <div className="space-y-4 w-[500px]">
      {/* Success */}
      <Alert>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600 dark:text-green-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your profile has been updated successfully.
        </AlertDescription>
      </Alert>

      {/* Info */}
      <Alert>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-600 dark:text-blue-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          New features are now available in your dashboard.
        </AlertDescription>
      </Alert>

      {/* Warning */}
      <Alert>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-yellow-600 dark:text-yellow-400"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your storage is almost full. Please upgrade your plan.
        </AlertDescription>
      </Alert>

      {/* Error */}
      <Alert variant="destructive">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to process payment. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

/**
 * Alert with action button
 */
export const WithAction: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        <p>A new version of the app is available.</p>
        <button className="mt-2 underline text-sm font-medium">
          Update Now
        </button>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with links
 */
export const WithLinks: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <AlertTitle>Privacy Policy Updated</AlertTitle>
      <AlertDescription>
        <p>
          We've updated our privacy policy.{" "}
          <a href="#" className="underline font-medium">
            Read more
          </a>{" "}
          or{" "}
          <a href="#" className="underline font-medium">
            view changes
          </a>
          .
        </p>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Long content
 */
export const LongContent: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <AlertTitle>Important Notice</AlertTitle>
      <AlertDescription>
        <p>
          We are performing scheduled maintenance on our servers. During this time,
          some features may be unavailable. We apologize for any inconvenience this
          may cause. The maintenance window is expected to last approximately 2 hours.
        </p>
        <p className="mt-2">
          If you experience any issues after the maintenance is complete, please
          contact our support team at support@example.com.
        </p>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Dark mode support
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark space-y-4 w-[500px]">
      <Alert>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is how alerts look in dark mode.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          Error alerts also support dark mode.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
