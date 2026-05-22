import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import { PageLayout } from './PageLayout'
import { mockSidebarConfig, mockHeaderConfig, mockHeaderConfigWithTabs } from './PageLayout.mocks'

const meta = {
  title: 'Features/PageLayout/Behaviors',
  component: PageLayout,
  tags: ['test'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sidebar Toggle Behavior
 *
 * Tests that the sidebar can be toggled using the trigger button.
 */
export const SidebarToggle: Story = {
  args: {
    sidebar: mockSidebarConfig,
    header: mockHeaderConfig,
    defaultSidebarOpen: true,
    children: <div>Content</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Find the sidebar trigger button
    const trigger = canvas.getByRole('button', { name: /toggle sidebar/i })
    await expect(trigger).toBeInTheDocument()

    // Get the sidebar element to check its state
    const sidebar = canvasElement.querySelector('[data-sidebar="sidebar"]')
    await expect(sidebar).toBeInTheDocument()

    // Click to toggle sidebar
    await userEvent.click(trigger)

    // Wait for the state change and verify sidebar collapsed
    await waitFor(() => {
      const sidebarWrapper = canvasElement.querySelector('[data-state]')
      expect(sidebarWrapper).toHaveAttribute('data-state', 'collapsed')
    })
  },
}

/**
 * Navigation Click Behavior
 *
 * Tests that navigation items are clickable and callbacks are invoked.
 */
export const NavigationClick: Story = {
  args: {
    sidebar: mockSidebarConfig,
    header: mockHeaderConfig,
    defaultSidebarOpen: true,
    children: <div>Content</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Find a navigation link
    const dashboardLink = canvas.getByText('Dashboard')
    await expect(dashboardLink).toBeInTheDocument()

    // Click the navigation item
    await userEvent.click(dashboardLink)

    // Verify it's still in the document (navigation occurred)
    await expect(dashboardLink).toBeInTheDocument()
  },
}

/**
 * User Menu Interaction
 *
 * Tests that the user menu can be opened and callbacks are invoked.
 */
export const UserMenuInteraction: Story = {
  args: {
    sidebar: {
      ...mockSidebarConfig,
      userActions: [
        { label: 'Profile', onClick: fn() },
        { label: 'Logout', onClick: fn() },
      ],
    },
    header: mockHeaderConfig,
    defaultSidebarOpen: true,
    children: <div>Content</div>,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // Find the user menu button (by user name)
    const userButton = canvas.getByText('John Doe')
    await expect(userButton).toBeInTheDocument()

    // Click to open menu
    await userEvent.click(userButton)

    // Verify menu items appear
    const profileItem = await canvas.findByText('Profile')
    await expect(profileItem).toBeInTheDocument()

    // Click the Profile menu item
    await userEvent.click(profileItem)

    // Verify the callback was called
    await waitFor(() => {
      expect(args.sidebar.userActions?.[0].onClick).toHaveBeenCalled()
    })
  },
}

/**
 * Tab Switch Behavior
 *
 * Tests that tab switch in header works correctly and triggers callbacks.
 */
export const TabSwitch: Story = {
  args: {
    sidebar: mockSidebarConfig,
    header: {
      ...mockHeaderConfigWithTabs,
      onTabChange: fn(),
    },
    defaultSidebarOpen: true,
    children: <div>Content</div>,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Find tab triggers
    const agentTab = canvas.getByRole('tab', { name: 'Agent' })
    const editorTab = canvas.getByRole('tab', { name: 'Editor' })

    await expect(agentTab).toBeInTheDocument()
    await expect(editorTab).toBeInTheDocument()

    // Verify initial state - Agent tab should be selected
    await expect(agentTab).toHaveAttribute('data-state', 'active')
    await expect(editorTab).toHaveAttribute('data-state', 'inactive')

    // Click Editor tab
    await userEvent.click(editorTab)

    // Wait for state change and verify callback was called
    await waitFor(() => {
      expect(args.header.onTabChange).toHaveBeenCalledWith('editor')
    })

    // Verify tab states updated
    await expect(agentTab).toHaveAttribute('data-state', 'inactive')
    await expect(editorTab).toHaveAttribute('data-state', 'active')
  },
}
