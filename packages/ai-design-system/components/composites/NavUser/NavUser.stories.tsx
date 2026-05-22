import type { Meta, StoryObj } from '@storybook/react'
import { NavUser } from './NavUser'
import { SidebarProvider, Sidebar, SidebarFooter } from '@/components/primitives/Sidebar'

const meta = {
  title: 'Composites/NavUser',
  component: NavUser,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavUser>

export default meta
type Story = StoryObj<typeof meta>

const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://github.com/shadcn.png',
}

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const WithActions: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarFooter>
          <NavUser
            user={user}
            actions={[
              { label: 'Profile', onClick: () => console.log('Profile') },
              { label: 'Settings', onClick: () => console.log('Settings') },
              { label: 'Logout', onClick: () => console.log('Logout') },
            ]}
          />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
}
