/**
 * Mock data for PageLayout feature stories
 */

export const mockSidebarConfig = {
  logo: { icon: 'command', text: 'Acme Inc.', href: '/' },
  mainNavigation: [
    { title: 'Dashboard', url: '#', icon: 'layout-dashboard', isActive: true },
    { title: 'Projects', url: '#', icon: 'folder' },
    { title: 'Tasks', url: '#', icon: 'check-square' },
    { title: 'Analytics', url: '#', icon: 'bar-chart' },
  ],
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
  userActions: [
    { label: 'Profile', onClick: () => console.log('Profile') },
    { label: 'Settings', onClick: () => console.log('Settings') },
    { label: 'Logout', onClick: () => console.log('Logout') },
  ],
}

export const mockHeaderConfig = {
  title: 'Dashboard',
}

export const mockHeaderConfigWithTabs = {
  title: 'Workspace',
  tabs: [
    { value: 'agent', label: 'Agent' },
    { value: 'editor', label: 'Editor' }
  ],
  defaultTab: 'agent',
}
