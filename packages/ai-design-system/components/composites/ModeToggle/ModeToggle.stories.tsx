import type { Meta, StoryObj } from '@storybook/react'
import { ModeToggle } from './ModeToggle'

/**
 * ModeToggle Composite Stories
 *
 * The ModeToggle component is a composite that allows users to switch between light, dark, and system themes.
 * It composes Button and DropdownMenu primitives.
 *
 * ## Features
 * - Light, dark, and system theme modes
 * - Persistent theme preference via localStorage
 * - Automatic system theme detection
 * - Accessible dropdown menu
 * - Icon-based toggle button
 *
 * ## Accessibility
 * - Keyboard navigation support
 * - Screen reader labels
 * - Focus management
 * - ARIA attributes
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Place in application header or settings
 * - Use consistent placement across pages
 * - Provide visual feedback for current theme
 *
 * ### Don'ts
 * - Don't place multiple theme toggles
 * - Don't override user's system preference without consent
 * - Don't hide the toggle in nested menus
 */
const meta = {
  title: 'Composites/ModeToggle',
  component: ModeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme mode switcher component that composes Button and DropdownMenu primitives.',
      },
    },
  },
} satisfies Meta<typeof ModeToggle>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default mode toggle
 *
 * Basic theme switcher with light, dark, and system options.
 */
export const Default: Story = {
  render: () => <ModeToggle />,
}

/**
 * In Header
 *
 * Mode toggle as it would appear in an application header.
 */
export const InHeader: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderBottom: '1px solid hsl(var(--border))',
        width: '600px',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '18px' }}>My Application</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>Settings</span>
        <ModeToggle />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common placement of the mode toggle in an application header.',
      },
    },
  },
}

/**
 * With Navigation
 *
 * Mode toggle alongside other navigation items.
 */
export const WithNavigation: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderBottom: '1px solid hsl(var(--border))',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '18px', marginRight: 'auto' }}>Logo</div>
      <a href="#" style={{ fontSize: '14px', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>
        Home
      </a>
      <a href="#" style={{ fontSize: '14px', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>
        About
      </a>
      <a href="#" style={{ fontSize: '14px', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>
        Contact
      </a>
      <ModeToggle />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mode toggle integrated with navigation menu.',
      },
    },
  },
}

/**
 * Light Theme Preview
 *
 * Mode toggle in light theme context.
 */
export const LightTheme: Story = {
  render: () => (
    <div className="light" style={{ padding: '24px', background: 'hsl(0 0% 100%)', borderRadius: '8px' }}>
      <div style={{ marginBottom: '16px', color: 'hsl(222.2 47.4% 11.2%)' }}>
        <p style={{ marginBottom: '8px' }}>Current theme: Light</p>
        <ModeToggle />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mode toggle appearance in light theme.',
      },
    },
    backgrounds: { disable: true },
  },
}

/**
 * Dark Theme Preview
 *
 * Mode toggle in dark theme context.
 */
export const DarkTheme: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ marginBottom: '16px', color: 'hsl(210 40% 98%)' }}>
        <p style={{ marginBottom: '8px' }}>Current theme: Dark</p>
        <ModeToggle />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mode toggle appearance in dark theme.',
      },
    },
    backgrounds: { disable: true },
  },
}

/**
 * Interactive Demo
 *
 * Try switching themes to see the effect.
 */
export const InteractiveDemo: Story = {
  render: () => (
    <div style={{ padding: '24px', border: '1px solid hsl(var(--border))', borderRadius: '8px', minWidth: '400px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Theme Switcher Demo</h3>
        <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>
          Click the button below to switch between light, dark, and system themes.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px' }}>Theme:</span>
        <ModeToggle />
      </div>
      <div style={{ marginTop: '24px', padding: '16px', background: 'hsl(var(--muted))', borderRadius: '6px' }}>
        <p style={{ fontSize: '14px' }}>
          This content will adapt to the selected theme. The theme preference is saved to localStorage.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing theme switching in action.',
      },
    },
  },
}
