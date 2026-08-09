import type { Meta, StoryObj } from '@storybook/react'
import { SystemMessage } from './SystemMessage'

const meta: Meta<typeof SystemMessage> = {
  title: 'Composites/SystemMessage',
  component: SystemMessage,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SystemMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: {
      id: '1',
      content: 'Background task completed successfully.',
    },
  },
}

export const WithLongContent: Story = {
  args: {
    message: {
      id: '2',
      content: 'The analysis has been completed and the results are now available for review. You can access the full report from the dashboard.',
    },
  },
}

export const WithCustomRenderer: Story = {
  args: {
    message: {
      id: '3',
      content: 'Audio message received',
    },
    renderContent: (content) => (
      <div className="flex items-center gap-2">
        <span className="text-xs">🎵</span>
        <span>{content}</span>
      </div>
    ),
  },
}
