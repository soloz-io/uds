import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

/**
 * Button Primitive Stories
 *
 * The Button component is a foundational primitive for triggering actions and navigation.
 * It extends shadcn/ui's Button with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Multiple visual variants for different contexts
 * - Flexible sizing options including icon-only buttons
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * - Dark mode support
 * - Composition via asChild prop (Radix Slot)
 *
 * ## Accessibility
 * - Semantic `<button>` element by default
 * - Proper focus management with visible focus indicators
 * - Disabled state prevents interaction and is announced to screen readers
 * - Loading states should include aria-busy and descriptive text
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use descriptive button text that clearly indicates the action
 * - Use the `default` variant for primary actions
 * - Use `destructive` variant for irreversible or dangerous actions
 * - Use `outline` or `ghost` for secondary actions
 * - Provide adequate touch target size (minimum 44x44px)
 *
 * ### Don'ts
 * - Don't use buttons for navigation (use links with asChild instead)
 * - Don't rely on color alone to convey meaning
 * - Don't disable buttons without explanation (consider tooltip)
 * - Don't use icon-only buttons without accessible labels
 */
const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      description: 'Size variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and prevents interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Renders as a child element using Radix Slot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes, built on shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default button variant
 *
 * The default variant is used for primary actions that are most important
 * on the current screen. Use sparingly to maintain visual hierarchy.
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}

/**
 * Destructive variant
 *
 * Used for dangerous or irreversible actions like deletions.
 * The red color signals caution to users before proceeding.
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
    size: 'default',
  },
}

/**
 * Outline variant
 *
 * Used for secondary actions that are less important than the primary action.
 * Provides clear boundaries with a lighter visual weight.
 */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
    size: 'default',
  },
}

/**
 * Secondary variant
 *
 * Used for alternative actions that complement the primary action.
 * Provides a middle ground between default and ghost variants.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
    size: 'default',
  },
}

/**
 * Ghost variant
 *
 * Used for tertiary actions with minimal visual weight.
 * Appears on hover to reduce visual clutter.
 */
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
    size: 'default',
  },
}

/**
 * Link variant
 *
 * Styled to look like a hyperlink while maintaining button semantics.
 * Use for actions that feel more like navigation.
 */
export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
    size: 'default',
  },
}

/**
 * Small size
 *
 * Compact button for tight spaces or less important actions.
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'default',
    size: 'sm',
  },
}

/**
 * Large size
 *
 * Prominent button for important calls to action.
 * Provides larger touch targets for better mobile accessibility.
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'default',
    size: 'lg',
  },
}

/**
 * Icon size (default)
 *
 * Square button sized for a single icon.
 * Note: This example uses text for demonstration. In production,
 * use the Icon component from the icon registry when available.
 */
export const IconSize: Story = {
  args: {
    children: '✓',
    variant: 'default',
    size: 'icon',
    'aria-label': 'Confirm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons require an accessible label via aria-label prop.',
      },
    },
  },
}

/**
 * Small icon size
 *
 * Compact square button for icon-only actions in dense UIs.
 */
export const IconSmall: Story = {
  args: {
    children: '✓',
    variant: 'outline',
    size: 'icon-sm',
    'aria-label': 'Confirm',
  },
}

/**
 * Large icon size
 *
 * Prominent square button for icon-only primary actions.
 */
export const IconLarge: Story = {
  args: {
    children: '✓',
    variant: 'default',
    size: 'icon-lg',
    'aria-label': 'Confirm',
  },
}

/**
 * Disabled state
 *
 * Disabled buttons cannot be interacted with and are visually dimmed.
 * Consider providing context about why the button is disabled via tooltip.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'default',
    size: 'default',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons should include context about why they are disabled, typically via a tooltip.',
      },
    },
  },
}

/**
 * Disabled destructive
 *
 * Shows how the destructive variant appears when disabled.
 */
export const DisabledDestructive: Story = {
  args: {
    children: 'Disabled Delete',
    variant: 'destructive',
    size: 'default',
    disabled: true,
  },
}

/**
 * All Variants Showcase
 *
 * Displays all button variants side by side for quick comparison.
 * Demonstrates the visual hierarchy and relative prominence of each variant.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Variants</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Icon Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="icon-sm" variant="outline" aria-label="Small icon button">
            ✓
          </Button>
          <Button size="icon" variant="outline" aria-label="Default icon button">
            ✓
          </Button>
          <Button size="icon-lg" variant="outline" aria-label="Large icon button">
            ✓
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>States</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Destructive Variants</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="destructive">Delete</Button>
          <Button variant="destructive" disabled>
            Delete Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all button variants, sizes, and states available in the design system.',
      },
    },
  },
}

/**
 * With Long Text
 *
 * Demonstrates how buttons handle longer text content.
 * The button automatically adjusts width to accommodate content.
 */
export const WithLongText: Story = {
  args: {
    children: 'Button with longer text content',
    variant: 'default',
    size: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons automatically expand to fit their content while maintaining consistent padding.',
      },
    },
  },
}

/**
 * Responsive Layout Example
 *
 * Shows buttons in a typical action layout pattern.
 * Demonstrates proper spacing and alignment for multiple buttons.
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="default">Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Reset</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common layout pattern for form actions or dialog buttons.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * All variants in dark mode to verify theming compatibility.
 * The Button component automatically adapts to dark mode via Tailwind's dark: variants.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default" disabled>
            Disabled
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants automatically adapt to dark mode with appropriate contrast and visibility.',
      },
    },
    backgrounds: { disable: true },
  },
}
