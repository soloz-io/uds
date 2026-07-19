import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AppHeader, type TabItem } from './AppHeader'
import { Button } from '@/components/primitives/Button'
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/primitives/Sidebar'
import { mockTabs, mockTabsSingle, mockTabsEmpty, mockTabsMany } from './AppHeader.mocks'

const meta = {
  title: 'Composites/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default AppHeader
 *
 * Basic header with title only.
 */
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />
      </SidebarInset>
    </SidebarProvider>
  ),
}

/**
 * With Tab Switch
 *
 * Header with tab switch for mode selection.
 */
export const WithTabSwitch: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader
          title="Workspace"
          tabs={mockTabs}
          defaultTab="agent"
          onTabChange={fn()}
          actions={
            <Button size="sm">
              Settings
            </Button>
          }
        />
      </SidebarInset>
    </SidebarProvider>
  ),
}

/**
 * With Actions
 *
 * Header with action buttons.
 */
export const WithActions: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader
          title="Dashboard"
          actions={
            <>
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">New Item</Button>
            </>
          }
        />
      </SidebarInset>
    </SidebarProvider>
  ),
}

/**
 * Single Tab
 *
 * Header with single tab (edge case).
 */
export const SingleTab: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader
          title="Settings"
          tabs={mockTabsSingle}
          defaultTab="single"
          onTabChange={fn()}
        />
      </SidebarInset>
    </SidebarProvider>
  ),
}

/**
 * Empty Tabs
 *
 * Header with no tabs (edge case).
 */
export const EmptyTabs: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader
          title="Simple Page"
          tabs={mockTabsEmpty}
          onTabChange={fn()}
        />
      </SidebarInset>
    </SidebarProvider>
  ),
}

/**
 * Many Tabs
 *
 * Header with multiple tabs to test overflow.
 */
export const ManyTabs: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader
          title="Analytics"
          tabs={mockTabsMany}
          defaultTab="agent"
          onTabChange={fn()}
        />
      </SidebarInset>
    </SidebarProvider>
  ),
}

/**
 * With Button Switcher
 *
 * Header with a button switcher (dropdown) instead of a title.
 */
export const WithButtonSwitcher: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AppHeader
          buttonSwitcherProps={{
            items: [
              { id: "1", name: "Alpha Workflow" },
              { id: "2", name: "Beta Workflow" },
            ],
            activeId: "1",
            onSelect: fn(),
          }}
          actions={
            <Button size="sm">
              Deploy
            </Button>
          }
        />
      </SidebarInset>
    </SidebarProvider>
  ),
}
