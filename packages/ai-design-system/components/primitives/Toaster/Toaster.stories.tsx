import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "sonner";
import { Button } from "../Button";

/**
 * Toast notification system powered by sonner.
 * Place a single `<Toaster />` near the root of your app to render
 * toast notifications triggered via the `toast()` function.
 *
 * ## Features
 * - Success, error, info, warning variants
 * - Rich colors for semantic distinction
 * - Action buttons on toasts
 * - Customizable positioning (6 positions)
 * - Keyboard dismissible
 * - Auto-close with configurable duration
 * - Promise-based toasts for async operations
 * - Expandable for mobile
 *
 * ## Usage
 * ```tsx
 * import { Toaster, toast } from 'ai-design-system';
 *
 * function App() {
 *   return (
 *     <>
 *       <Toaster position="bottom-right" richColors />
 *       <button onClick={() => toast.success("Saved!")}>Save</button>
 *     </>
 *   );
 * }
 * ```
 */
const meta: Meta<typeof Toaster> = {
  title: "Primitives/Toaster",
  component: Toaster,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A toast notification system that renders a stack of notifications at a configurable position on the screen. Works alongside the `toast()` function to display ephemeral feedback messages.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

/**
 * Default toast setup. Click each button to trigger a toast notification
 * in the bottom-right corner.
 */
export const Default: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center gap-4">
      <Toaster />
      <Button onClick={() => toast("Hello from sonner!")}>
        Show Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast("This toast has a description", {
          description: "Additional context for the notification",
        })}
      >
        With Description
      </Button>
    </div>
  ),
};

/**
 * Toasts with semantic colors using the `richColors` prop.
 * Use `toast.success()`, `toast.error()`, and the base `toast()` for info.
 */
export const RichColors: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center gap-4">
      <Toaster richColors />
      <Button
        onClick={() =>
          toast.success("Changes saved successfully")
        }
      >
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error("Failed to save changes")
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.info("New updates available")
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Session expiring soon")
        }
      >
        Warning
      </Button>
    </div>
  ),
};

/**
 * Toasts with a close button for manual dismissal.
 */
export const WithCloseButton: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center gap-4">
      <Toaster closeButton richColors />
      <Button
        onClick={() =>
          toast.success("Dismiss me with the X button")
        }
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("This one too has a close button")
        }
      >
        Error Toast
      </Button>
    </div>
  ),
};

/**
 * Toasts can be positioned in any of the 6 available corners.
 */
export const Positions: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <Toaster />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast("Top-Left", {
              position: "top-left",
            })
          }
        >
          Top-Left
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Top-Center", {
              position: "top-center",
            })
          }
        >
          Top-Center
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Top-Right", {
              position: "top-right",
            })
          }
        >
          Top-Right
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Bottom-Left", {
              position: "bottom-left",
            })
          }
        >
          Bottom-Left
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Bottom-Center", {
              position: "bottom-center",
            })
          }
        >
          Bottom-Center
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Bottom-Right", {
              position: "bottom-right",
            })
          }
        >
          Bottom-Right
        </Button>
      </div>
    </div>
  ),
};

/**
 * Toasts with action buttons for undo or retry flows.
 */
export const WithAction: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center gap-4">
      <Toaster richColors />
      <Button
        onClick={() =>
          toast("Item deleted", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Restored!"),
            },
          })
        }
      >
        Delete Item
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Upload failed", {
            action: {
              label: "Retry",
              onClick: () =>
                toast.info("Retrying upload..."),
            },
          })
        }
      >
        Fail Upload
      </Button>
    </div>
  ),
};

/**
 * Customize how long a toast stays visible using the `duration` option.
 * Set to `Infinity` for persistent toasts that require manual dismissal.
 */
export const CustomDuration: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center gap-4">
      <Toaster />
      <Button
        onClick={() =>
          toast("Quick toast (1s)", { duration: 1000 })
        }
      >
        1 Second
      </Button>
      <Button
        onClick={() =>
          toast("Normal toast (4s)", { duration: 4000 })
        }
      >
        4 Seconds
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast("Persistent (manual dismiss)", {
            duration: Infinity,
          })
        }
      >
        Persistent
      </Button>
    </div>
  ),
};

/**
 * Promise-based toasts for async operations.
 * Shows loading, then success or error based on the promise outcome.
 */
export const PromiseToast: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center gap-4">
      <Toaster richColors />
      <Button
        onClick={() => {
          const promise = new Promise<string>((resolve) =>
            setTimeout(
              () => resolve("Data loaded!"),
              2000,
            ),
          );
          toast.promise(promise, {
            loading: "Loading...",
            success: (data: string) => data,
            error: "Failed to load",
          });
        }}
      >
        Load Data (2s)
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          const promise = new Promise<string>((_, reject) =>
            setTimeout(
              () => reject(new Error("Network error")),
              2000,
            ),
          );
          toast.promise(promise, {
            loading: "Uploading...",
            success: "Uploaded!",
            error: "Upload failed",
          });
        }}
      >
        Fail Upload (2s)
      </Button>
    </div>
  ),
};

/**
 * Expandable toasts for mobile-friendly stacked notifications.
 */
export const Expandable: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <Toaster expand visibleToasts={9} />
      <p className="text-sm text-muted-foreground">
        Click rapidly to stack multiple toasts
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() =>
            toast("Toast notification " + (Date.now() % 1000))
          }
        >
          Add Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.success("Success " + (Date.now() % 1000))
          }
        >
          Add Success
        </Button>
      </div>
    </div>
  ),
};
