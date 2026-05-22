import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./Input"

/**
 * Input Primitive Stories
 *
 * The Input primitive provides a consistent text input experience across the application.
 * It supports various input types, validation states, and accessibility features.
 */

const meta = {
  title: "Primitives/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A foundational input component built on shadcn/ui Input. Supports all native HTML input types, validation states, and accessibility features including ARIA attributes for error states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The type of input field",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Size variant of the input",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    state: {
      control: "select",
      options: ["default", "error", "success", "warning"],
      description: "Visual state of the input",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when input is empty",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
      table: {
        defaultValue: { summary: false },
      },
    },
    "aria-invalid": {
      control: "boolean",
      description: "Indicates whether the input value is invalid",
      table: {
        defaultValue: { summary: false },
      },
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default text input
 */
export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Enter text...",
  },
}

/**
 * Email input with appropriate keyboard on mobile devices
 */
export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
}

/**
 * Password input with masked characters
 */
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
}

/**
 * Number input with increment/decrement controls
 */
export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter number",
  },
}

/**
 * Search input with search icon styling
 */
export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
}

/**
 * Telephone input with appropriate keyboard on mobile devices
 */
export const Telephone: Story = {
  args: {
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
}

/**
 * URL input with URL validation
 */
export const URL: Story = {
  args: {
    type: "url",
    placeholder: "https://example.com",
  },
}

/**
 * Disabled input that cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Disabled input",
    disabled: true,
  },
}

/**
 * Input with pre-filled value
 */
export const WithValue: Story = {
  args: {
    type: "text",
    defaultValue: "Pre-filled value",
  },
}

/**
 * Invalid input showing error state
 */
export const Invalid: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
    defaultValue: "invalid-email",
    "aria-invalid": true,
  },
}

/**
 * File input for file selection
 */
export const File: Story = {
  args: {
    type: "file",
  },
}

/**
 * Small input size
 */
export const Small: Story = {
  args: {
    type: "text",
    placeholder: "Small input",
    size: "sm",
  },
}

/**
 * Large input size
 */
export const Large: Story = {
  args: {
    type: "text",
    placeholder: "Large input",
    size: "lg",
  },
}

/**
 * Error state input
 */
export const ErrorState: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
    defaultValue: "invalid-email",
    state: "error",
  },
}

/**
 * Success state input
 */
export const SuccessState: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
    defaultValue: "valid@email.com",
    state: "success",
  },
}

/**
 * Warning state input
 */
export const WarningState: Story = {
  args: {
    type: "text",
    placeholder: "Enter text",
    defaultValue: "This might need attention",
    state: "warning",
  },
}

/**
 * Size variants showcase
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label className="text-sm font-medium mb-1 block">Small</label>
        <Input type="text" placeholder="Small input" size="sm" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Default</label>
        <Input type="text" placeholder="Default input" size="default" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Large</label>
        <Input type="text" placeholder="Large input" size="lg" />
      </div>
    </div>
  ),
}

/**
 * State variants showcase
 */
export const StateVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label className="text-sm font-medium mb-1 block">Default State</label>
        <Input type="text" placeholder="Default state" state="default" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Error State</label>
        <Input type="text" placeholder="Error state" state="error" defaultValue="Invalid input" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Success State</label>
        <Input type="text" placeholder="Success state" state="success" defaultValue="Valid input" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Warning State</label>
        <Input type="text" placeholder="Warning state" state="warning" defaultValue="Needs attention" />
      </div>
    </div>
  ),
}

/**
 * Combined variants showcase
 */
export const CombinedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label className="text-sm font-medium mb-1 block">Small Error</label>
        <Input type="text" placeholder="Small error" size="sm" state="error" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Default Success</label>
        <Input type="text" placeholder="Default success" size="default" state="success" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Large Warning</label>
        <Input type="text" placeholder="Large warning" size="lg" state="warning" />
      </div>
    </div>
  ),
}

/**
 * All input variants and states showcased together
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label className="text-sm font-medium mb-1 block">Default Text</label>
        <Input type="text" placeholder="Enter text..." />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Email</label>
        <Input type="email" placeholder="email@example.com" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Password</label>
        <Input type="password" placeholder="Enter password" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Number</label>
        <Input type="number" placeholder="Enter number" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Search</label>
        <Input type="search" placeholder="Search..." />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">With Value</label>
        <Input type="text" defaultValue="Pre-filled value" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Disabled</label>
        <Input type="text" placeholder="Disabled input" disabled />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Invalid</label>
        <Input
          type="email"
          placeholder="email@example.com"
          defaultValue="invalid-email"
          aria-invalid
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">File</label>
        <Input type="file" />
      </div>
    </div>
  ),
}
