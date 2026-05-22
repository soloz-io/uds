import type { Meta, StoryObj } from '@storybook/react'
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from './Sidebar'

/**
 * Sidebar Primitive Stories
 *
 * The Sidebar component is a foundational primitive for application navigation.
 * It extends shadcn/ui's Sidebar with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Collapsible sidebar with smooth animations
 * - Responsive behavior (mobile/desktop)
 * - Keyboard navigation support
 * - Multiple variants (sidebar, floating, inset)
 * - Dark mode support
 *
 * ## Accessibility
 * - Proper ARIA attributes for navigation
 * - Keyboard shortcuts (Cmd/Ctrl + B to toggle)
 * - Focus management
 * - Screen reader announcements
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use for primary application navigation
 * - Group related navigation items
 * - Provide clear labels and icons
 * - Use SidebarProvider to wrap the layout
 *
 * ### Don'ts
 * - Don't use for secondary navigation
 * - Don't nest multiple sidebars
 * - Don't omit navigation labels
 * - Don't use for temporary content (use Drawer instead)
 */
const meta = {
  title: 'Primitives/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A collapsible sidebar component for application navigation, built on shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default sidebar
 *
 * Basic sidebar with navigation items.
 */
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div style={{ display: 'flex', minHeight: '400px', width: '100%' }}>
        <Sidebar>
          <SidebarHeader>
            <div style={{ padding: '16px', fontWeight: 600 }}>My App</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Projects</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Tasks</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div style={{ padding: '16px', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              © 2024 My App
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header style={{ borderBottom: '1px solid hsl(var(--border))', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SidebarTrigger />
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Page Title</h1>
          </header>
          <main style={{ padding: '24px' }}>
            <p>Main content area. Click the trigger button to toggle the sidebar.</p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
}

/**
 * With Groups
 *
 * Sidebar with grouped navigation items.
 */
export const WithGroups: Story = {
  render: () => (
    <SidebarProvider>
      <div style={{ display: 'flex', minHeight: '400px', width: '100%' }}>
        <Sidebar>
          <SidebarHeader>
            <div style={{ padding: '16px', fontWeight: 600 }}>My App</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Analytics</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>All Projects</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Favorites</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Archived</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Profile</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Preferences</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header style={{ borderBottom: '1px solid hsl(var(--border))', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SidebarTrigger />
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Grouped Navigation</h1>
          </header>
          <main style={{ padding: '24px' }}>
            <p>Sidebar with grouped navigation items for better organization.</p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use SidebarGroup to organize related navigation items.',
      },
    },
  },
}

/**
 * With Active State
 *
 * Sidebar showing active navigation item.
 */
export const WithActiveState: Story = {
  render: () => (
    <SidebarProvider>
      <div style={{ display: 'flex', minHeight: '400px', width: '100%' }}>
        <Sidebar>
          <SidebarHeader>
            <div style={{ padding: '16px', fontWeight: 600 }}>My App</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Projects</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Tasks</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header style={{ borderBottom: '1px solid hsl(var(--border))', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SidebarTrigger />
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Dashboard</h1>
          </header>
          <main style={{ padding: '24px' }}>
            <p>The Dashboard item is marked as active in the sidebar.</p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use isActive prop to highlight the current page in navigation.',
      },
    },
  },
}

/**
 * Collapsed by Default
 *
 * Sidebar that starts in collapsed state.
 */
export const CollapsedByDefault: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <div style={{ display: 'flex', minHeight: '400px', width: '100%' }}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div style={{ padding: '16px', fontWeight: 600 }}>App</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Projects">Projects</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Tasks">Tasks</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header style={{ borderBottom: '1px solid hsl(var(--border))', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SidebarTrigger />
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Collapsed Sidebar</h1>
          </header>
          <main style={{ padding: '24px' }}>
            <p>Sidebar starts collapsed. Hover over items to see tooltips.</p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Set defaultOpen={false} to start with a collapsed sidebar.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * Sidebar in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ background: 'hsl(222.2 84% 4.9%)' }}>
      <SidebarProvider>
        <div style={{ display: 'flex', minHeight: '400px', width: '100%' }}>
          <Sidebar>
            <SidebarHeader>
              <div style={{ padding: '16px', fontWeight: 600 }}>My App</div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Projects</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Tasks</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div style={{ padding: '16px', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                © 2024 My App
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header style={{ borderBottom: '1px solid hsl(var(--border))', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SidebarTrigger />
              <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>Dark Mode</h1>
            </header>
            <main style={{ padding: '24px', color: 'hsl(var(--foreground))' }}>
              <p>Sidebar automatically adapts to dark mode with appropriate contrast.</p>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar automatically adapts to dark mode with appropriate contrast and visibility.',
      },
    },
    backgrounds: { disable: true },
  },
}
