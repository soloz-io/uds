import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ProjectSwitcher } from './ProjectSwitcher'

const meta = {
  title: 'Composites/ProjectSwitcher',
  component: ProjectSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProjectSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    projects: [
      { id: '1', name: 'Atlas' },
      { id: '2', name: 'Beacon' },
      { id: '3', name: 'Cascade' },
    ],
    selectedProjectId: '1',
    onSelectProject: fn(),
    onCreateProject: fn(),
  },
}

export const Empty: Story = {
  args: {
    projects: [],
    selectedProjectId: null,
    onSelectProject: fn(),
    onCreateProject: fn(),
  },
}
