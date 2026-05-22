import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

/**
 * Separator Primitive Stories
 *
 * The Separator component is a foundational primitive for visually dividing content.
 * It extends shadcn/ui's Separator with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Horizontal and vertical orientations
 * - Semantic HTML with proper ARIA attributes
 * - Consistent styling across the application
 * - Dark mode support
 * - Decorative by default (not announced to screen readers)
 *
 * ## Accessibility
 * - Uses semantic separator role
 * - Decorative by default (aria-hidden)
 * - Can be made non-decorative for semantic separators
 * - Maintains proper color contrast ratios
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use to visually separate content sections
 * - Use horizontal separators for vertical content flow
 * - Use vertical separators for horizontal content flow
 * - Keep decorative for purely visual separators
 *
 * ### Don'ts
 * - Don't use as a border replacement
 * - Don't overuse - maintain visual hierarchy
 * - Don't rely solely on separators to convey structure
 */
const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the separator',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is purely decorative',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A visual separator component for dividing content, built on shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default (Horizontal)
 *
 * Basic horizontal separator.
 */
export const Default: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Separator />
    </div>
  ),
}

/**
 * Vertical
 *
 * Vertical separator for horizontal content layouts.
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100px', alignItems: 'center', gap: '16px' }}>
      <div>Left Content</div>
      <Separator orientation="vertical" />
      <div>Right Content</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical separators are useful for dividing horizontally arranged content.',
      },
    },
  },
}

/**
 * In Content
 *
 * Separator used to divide text content sections.
 */
export const InContent: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Section 1</h3>
        <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
          This is the first section of content with some descriptive text.
        </p>
      </div>
      <Separator />
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Section 2</h3>
        <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
          This is the second section of content with more descriptive text.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Separators help create visual hierarchy between content sections.',
      },
    },
  },
}

/**
 * In Navigation
 *
 * Separator used in navigation menus.
 */
export const InNavigation: Story = {
  render: () => (
    <div style={{ width: '200px', padding: '8px', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}>
      <div style={{ padding: '8px', fontSize: '14px' }}>Profile</div>
      <div style={{ padding: '8px', fontSize: '14px' }}>Settings</div>
      <Separator style={{ margin: '8px 0' }} />
      <div style={{ padding: '8px', fontSize: '14px', color: 'hsl(var(--destructive))' }}>Logout</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Separators can group related navigation items and separate destructive actions.',
      },
    },
  },
}

/**
 * Multiple Sections
 *
 * Multiple separators dividing several content sections.
 */
export const MultipleSections: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ padding: '16px 0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Header</h3>
      </div>
      <Separator />
      <div style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px' }}>Main content area with important information.</p>
      </div>
      <Separator />
      <div style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Footer information</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple separators can create clear visual sections in a layout.',
      },
    },
  },
}

/**
 * With Flex Layout
 *
 * Separators in a flexbox layout with multiple items.
 */
export const WithFlexLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div>Item 1</div>
      <Separator orientation="vertical" style={{ height: '20px' }} />
      <div>Item 2</div>
      <Separator orientation="vertical" style={{ height: '20px' }} />
      <div>Item 3</div>
      <Separator orientation="vertical" style={{ height: '20px' }} />
      <div>Item 4</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical separators work well in horizontal flex layouts.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * Separators in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
            Section 1
          </h3>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
            This is the first section of content.
          </p>
        </div>
        <Separator />
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
            Section 2
          </h3>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
            This is the second section of content.
          </p>
        </div>
        <Separator />
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'hsl(var(--foreground))' }}>Item 1</div>
          <Separator orientation="vertical" style={{ height: '20px' }} />
          <div style={{ color: 'hsl(var(--foreground))' }}>Item 2</div>
          <Separator orientation="vertical" style={{ height: '20px' }} />
          <div style={{ color: 'hsl(var(--foreground))' }}>Item 3</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Separators automatically adapt to dark mode with appropriate contrast.',
      },
    },
    backgrounds: { disable: true },
  },
}
