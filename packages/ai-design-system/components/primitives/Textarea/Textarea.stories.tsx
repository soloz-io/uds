import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./Textarea"

/**
 * Textarea Primitive Stories
 *
 * The Textarea primitive provides a consistent multi-line text input experience across the application.
 * It supports validation states, accessibility features, and automatic content-based resizing.
 */

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A foundational textarea component built on shadcn/ui Textarea. Supports multi-line text input, validation states, and accessibility features including ARIA attributes for error states. Features field-sizing-content for automatic height adjustment.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Size variant of the textarea",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    state: {
      control: "select",
      options: ["default", "error", "success", "warning"],
      description: "Visual state of the textarea",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when textarea is empty",
    },
    rows: {
      control: "number",
      description: "Number of visible text lines",
      table: {
        defaultValue: { summary: "undefined (auto-size)" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
      table: {
        defaultValue: { summary: false },
      },
    },
    "aria-invalid": {
      control: "boolean",
      description: "Indicates whether the textarea value is invalid",
      table: {
        defaultValue: { summary: false },
      },
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default textarea with automatic height adjustment
 */
export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
  },
}

/**
 * Textarea with fixed number of rows
 */
export const WithRows: Story = {
  args: {
    placeholder: "Enter description...",
    rows: 5,
  },
}

/**
 * Small textarea for brief comments
 */
export const Small: Story = {
  args: {
    placeholder: "Brief comment...",
    rows: 3,
  },
}

/**
 * Large textarea for longer content
 */
export const Large: Story = {
  args: {
    placeholder: "Enter detailed description...",
    rows: 10,
  },
}

/**
 * Disabled textarea that cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
}

/**
 * Textarea with pre-filled value
 */
export const WithValue: Story = {
  args: {
    defaultValue:
      "This is some pre-filled text content.\nIt spans multiple lines.\nYou can edit this text.",
    rows: 5,
  },
}

/**
 * Invalid textarea showing error state
 */
export const Invalid: Story = {
  args: {
    placeholder: "Enter valid text...",
    defaultValue: "This text contains errors",
    "aria-invalid": true,
    rows: 4,
  },
}

/**
 * Textarea with maximum length constraint
 */
export const WithMaxLength: Story = {
  args: {
    placeholder: "Maximum 200 characters...",
    maxLength: 200,
    rows: 4,
  },
}

/**
 * Read-only textarea for displaying content
 */
export const ReadOnly: Story = {
  args: {
    defaultValue:
      "This is read-only content.\nIt cannot be edited but can be selected and copied.",
    readOnly: true,
    rows: 4,
  },
}

/**
 * Small textarea size
 */
export const SmallSize: Story = {
  args: {
    placeholder: "Small textarea",
    size: "sm",
    rows: 4,
  },
}

/**
 * Large textarea size
 */
export const LargeSize: Story = {
  args: {
    placeholder: "Large textarea",
    size: "lg",
    rows: 4,
  },
}

/**
 * Error state textarea
 */
export const ErrorState: Story = {
  args: {
    placeholder: "Enter valid text...",
    defaultValue: "This text contains errors",
    state: "error",
    rows: 4,
  },
}

/**
 * Success state textarea
 */
export const SuccessState: Story = {
  args: {
    placeholder: "Enter text...",
    defaultValue: "This text is valid",
    state: "success",
    rows: 4,
  },
}

/**
 * Warning state textarea
 */
export const WarningState: Story = {
  args: {
    placeholder: "Enter text...",
    defaultValue: "This text might need attention",
    state: "warning",
    rows: 4,
  },
}

/**
 * Size variants showcase
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <div>
        <label className="text-sm font-medium mb-1 block">Small</label>
        <Textarea placeholder="Small textarea..." size="sm" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Default</label>
        <Textarea placeholder="Default textarea..." size="default" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Large</label>
        <Textarea placeholder="Large textarea..." size="lg" rows={3} />
      </div>
    </div>
  ),
}

/**
 * State variants showcase
 */
export const StateVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <div>
        <label className="text-sm font-medium mb-1 block">Default State</label>
        <Textarea placeholder="Default state..." state="default" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Error State</label>
        <Textarea placeholder="Error state..." state="error" defaultValue="Invalid content" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Success State</label>
        <Textarea placeholder="Success state..." state="success" defaultValue="Valid content" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Warning State</label>
        <Textarea placeholder="Warning state..." state="warning" defaultValue="Needs attention" rows={3} />
      </div>
    </div>
  ),
}

/**
 * Combined variants showcase
 */
export const CombinedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <div>
        <label className="text-sm font-medium mb-1 block">Small Error</label>
        <Textarea placeholder="Small error..." size="sm" state="error" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Default Success</label>
        <Textarea placeholder="Default success..." size="default" state="success" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Large Warning</label>
        <Textarea placeholder="Large warning..." size="lg" state="warning" rows={3} />
      </div>
    </div>
  ),
}

/**
 * All textarea variants and states showcased together
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <div>
        <label className="text-sm font-medium mb-1 block">Default (Auto-size)</label>
        <Textarea placeholder="Enter your message..." />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Small (3 rows)</label>
        <Textarea placeholder="Brief comment..." rows={3} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Medium (5 rows)</label>
        <Textarea placeholder="Enter description..." rows={5} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">With Value</label>
        <Textarea
          defaultValue="This is some pre-filled text content.&#10;It spans multiple lines.&#10;You can edit this text."
          rows={4}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Disabled</label>
        <Textarea placeholder="Disabled textarea" disabled rows={3} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Invalid</label>
        <Textarea
          placeholder="Enter valid text..."
          defaultValue="This text contains errors"
          aria-invalid
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">With Max Length (200)</label>
        <Textarea
          placeholder="Maximum 200 characters..."
          maxLength={200}
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Read Only</label>
        <Textarea
          defaultValue="This is read-only content.&#10;It cannot be edited but can be selected and copied."
          readOnly
          rows={3}
        />
      </div>
    </div>
  ),
}
