import type { Meta, StoryObj } from '@storybook/react'
import { AppSidebar } from './AppSidebar'
import { SidebarProvider } from '@/components/primitives/Sidebar'

const meta = {
  title: 'Blocks/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

const mainNav = [
  { title: 'Dashboard', url: '#', icon: 'layout-dashboard', isActive: true },
  { title: 'Projects', url: '#', icon: 'folder' },
  { title: 'Tasks', url: '#', icon: 'check-square' },
]

const secondaryNav = [
  { title: 'Settings', url: '#', icon: 'settings' },
  { title: 'Help', url: '#', icon: 'help-circle' },
]

const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://github.com/shadcn.png',
}

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar
        logo={{ icon: 'command', text: 'Acme Inc.', href: '/' }}
        mainNavigation={mainNav}
        user={user}
      />
    </SidebarProvider>
  ),
}

export const Complete: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar
        logo={{ icon: 'command', text: 'Acme Inc.', href: '/' }}
        mainNavigation={mainNav}
        secondaryNavigation={secondaryNav}
        documents={[
          { title: 'Project A', url: '#', icon: 'file' },
          { title: 'Project B', url: '#', icon: 'file' },
        ]}
        user={user}
        userActions={[
          { label: 'Profile', onClick: () => {} },
          { label: 'Logout', onClick: () => {} },
        ]}
      />
    </SidebarProvider>
  ),
}
