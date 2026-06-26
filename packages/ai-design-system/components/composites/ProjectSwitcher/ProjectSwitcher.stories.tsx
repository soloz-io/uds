import type { Meta, StoryObj } from '@storybook/react'
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
  args: {} as any,
}
