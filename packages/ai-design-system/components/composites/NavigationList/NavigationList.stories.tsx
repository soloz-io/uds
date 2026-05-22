import type { Meta, StoryObj } from '@storybook/react'
import { NavigationList } from './NavigationList'
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/primitives/Sidebar'

const meta = {
  title: 'Composites/NavigationList',
  component: NavigationList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationList>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { title: 'Dashboard', url: '#', icon: 'layout-dashboard' },
  { title: 'Projects', url: '#', icon: 'folder' },
  { title: 'Tasks', url: '#', icon: 'check-square' },
  { title: 'Settings', url: '#', icon: 'settings' },
]

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <NavigationList items={items} />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const WithActiveState: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <NavigationList
            items={items.map((item, i) => ({ ...item, isActive: i === 0 }))}
          />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}
