import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'
import { Input } from '../Input'
import { Checkbox } from '../Checkbox'

/**
 * Label Primitive Stories
 *
 * The Label component is a foundational primitive for labeling form controls.
 * It extends shadcn/ui's Label with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Semantic HTML label element
 * - Proper association with form controls via htmlFor
 * - Consistent typography and spacing
 * - Dark mode support
 * - Disabled state styling via peer selectors
 *
 * ## Accessibility
 * - Uses semantic `<label>` element
 * - Properly associates with form controls via htmlFor attribute
 * - Disabled state is visually indicated and announced to screen readers
 * - Maintains proper color contrast ratios
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Always associate labels with form controls using htmlFor
 * - Use clear, concise label text
 * - Place labels above or to the left of form controls
 * - Include required field indicators when appropriate
 *
 * ### Don'ts
 * - Don't use labels without associated form controls
 * - Don't rely on placeholder text as a replacement for labels
 * - Don't use overly technical or ambiguous label text
 */
const meta = {
  title: 'Primitives/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'ID of the form control this label is associated with',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An accessible label component for form inputs, built on shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default label
 *
 * Basic label with text content.
 */
export const Default: Story = {
  args: {
    children: 'Email Address',
  },
}

/**
 * With Input
 *
 * Label properly associated with an input field.
 * Clicking the label focuses the input.
 */
export const WithInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '300px' }}>
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The htmlFor attribute creates a proper association between the label and input.',
      },
    },
  },
}

/**
 * With Checkbox
 *
 * Label associated with a checkbox control.
 */
export const WithCheckbox: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels can be used with checkboxes for better clickable areas.',
      },
    },
  },
}

/**
 * Required Field
 *
 * Label with required field indicator.
 */
export const RequiredField: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '300px' }}>
      <Label htmlFor="username">
        Username <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
      </Label>
      <Input id="username" type="text" placeholder="Enter username" required />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Required fields should be clearly indicated with an asterisk or other visual marker.',
      },
    },
  },
}

/**
 * Disabled State
 *
 * Label associated with a disabled input.
 * The label automatically inherits disabled styling via peer selectors.
 */
export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '300px' }}>
      <Label htmlFor="disabled-input">Disabled Field</Label>
      <Input id="disabled-input" type="text" placeholder="Cannot edit" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels automatically adjust their appearance when associated with disabled controls.',
      },
    },
  },
}

/**
 * Form Layout Example
 *
 * Multiple labels in a typical form layout.
 */
export const FormLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" type="text" placeholder="John" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" type="text" placeholder="Doe" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="email-form">Email</Label>
        <Input id="email-form" type="email" placeholder="john.doe@example.com" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common form layout pattern with consistent label and input spacing.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * Labels in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label htmlFor="dark-email">Email Address</Label>
          <Input id="dark-email" type="email" placeholder="Enter your email" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label htmlFor="dark-disabled">Disabled Field</Label>
          <Input id="dark-disabled" type="text" placeholder="Cannot edit" disabled />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox id="dark-terms" />
          <Label htmlFor="dark-terms">Accept terms and conditions</Label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels automatically adapt to dark mode with appropriate contrast and visibility.',
      },
    },
    backgrounds: { disable: true },
  },
}
