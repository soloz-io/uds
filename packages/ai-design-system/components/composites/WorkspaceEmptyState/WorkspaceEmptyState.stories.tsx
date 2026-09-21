import type { Meta, StoryObj } from '@storybook/react'
import { WorkspaceEmptyState } from './WorkspaceEmptyState'

const meta = {
  title: 'Composites/WorkspaceEmptyState',
  component: WorkspaceEmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WorkspaceEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onWake: () => console.log('wake'),
    isWaking: false,
  },
}

export const Waking: Story = {
  args: {
    onWake: () => {},
    isWaking: true,
  },
}

export const CustomLabel: Story = {
  args: {
    label: 'The sandbox pod is currently stopped.',
    onWake: () => console.log('wake'),
    isWaking: false,
  },
}

export const NoWakeButton: Story = {
  args: {},
}
