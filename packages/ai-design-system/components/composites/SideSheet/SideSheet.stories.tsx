import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SideSheet } from "./SideSheet";

/**
 * SideSheet Composite
 *
 * A versatile slide-out drawer sheet from the side (desktop) or bottom (mobile).
 * Pure presentation composite wrapping Drawer with customizable header, content, and footer.
 */
const meta = {
  title: "Composites/SideSheet",
  component: SideSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof SideSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    title: "Side Sheet Title",
    description: "Detailed description or subtitle for this panel.",
    children: (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground">
          This is generic content rendered inside the SideSheet composite.
        </p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    open: true,
    title: "Review Details",
    description: "Inspect changes and take action.",
    children: (
      <div className="flex flex-col gap-3 text-sm">
        <p>Main sheet content area with scrollable content.</p>
      </div>
    ),
    footer: (
      <div className="flex items-center justify-end gap-2 w-full">
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground"
        >
          Confirm
        </button>
      </div>
    ),
  },
};
