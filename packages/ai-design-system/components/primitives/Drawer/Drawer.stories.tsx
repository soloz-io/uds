import type { Meta, StoryObj } from '@storybook/react'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from './Drawer'
import { Button } from '../Button'

/**
 * Drawer Primitive Stories
 *
 * The Drawer component is a foundational primitive for displaying content in a slide-out panel.
 * It extends shadcn/ui's Drawer with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Slide-out panel from bottom (mobile-first)
 * - Backdrop overlay
 * - Keyboard navigation support
 * - Focus management
 * - Dark mode support
 *
 * ## Accessibility
 * - Proper ARIA attributes for dialog
 * - Focus trap within drawer
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Focus restoration on close
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use for mobile-first slide-up panels
 * - Include DrawerTitle for accessibility
 * - Provide clear close actions
 * - Use for contextual actions and details
 *
 * ### Don'ts
 * - Don't use for critical information
 * - Don't nest drawers
 * - Don't use for complex forms (use Dialog instead)
 * - Don't omit title and description
 */
const meta = {
  title: 'Primitives/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A drawer component for displaying content in a slide-out panel, built on shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default drawer
 *
 * Basic drawer with trigger, content, header, and footer.
 */
export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>This is a drawer description that provides context.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: '16px' }}>
          <p>Drawer content goes here. This is a mobile-first slide-up panel.</p>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

/**
 * With Form
 *
 * Drawer containing a simple form.
 */
export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 500 }}>
              Name
            </label>
            <input
              id="name"
              defaultValue="John Doe"
              style={{
                padding: '8px 12px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 500 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              defaultValue="john@example.com"
              style={{
                padding: '8px 12px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawers can contain forms for quick edits and data entry.',
      },
    },
  },
}

/**
 * With List
 *
 * Drawer containing a list of items.
 */
export const WithList: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">View Options</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select an Option</DrawerTitle>
          <DrawerDescription>Choose from the available options below.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((option) => (
              <button
                key={option}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawers work well for displaying lists of options or actions.',
      },
    },
  },
}

/**
 * With Scrollable Content
 *
 * Drawer with content that scrolls.
 */
export const WithScrollableContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>View Details</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Long Content</DrawerTitle>
          <DrawerDescription>This drawer contains scrollable content.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ marginBottom: '12px', fontSize: '14px' }}>
              This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawers can handle scrollable content for longer information.',
      },
    },
  },
}

/**
 * Without Footer
 *
 * Drawer without a footer section.
 */
export const WithoutFooter: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Information</DrawerTitle>
          <DrawerDescription>This drawer has no footer actions.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: '16px' }}>
          <p>Content without footer actions. Users can swipe down or tap outside to close.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawers can omit the footer if no actions are needed.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * Drawer in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Dark Mode Drawer</DrawerTitle>
            <DrawerDescription>This drawer adapts to dark mode automatically.</DrawerDescription>
          </DrawerHeader>
          <div style={{ padding: '16px' }}>
            <p style={{ color: 'hsl(var(--foreground))' }}>
              Drawer content in dark mode with proper contrast and visibility.
            </p>
          </div>
          <DrawerFooter>
            <Button>Action</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawers automatically adapt to dark mode with appropriate contrast.',
      },
    },
    backgrounds: { disable: true },
  },
}
