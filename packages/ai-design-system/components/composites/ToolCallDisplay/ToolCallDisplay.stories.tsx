import type { Meta, StoryObj } from '@storybook/react'
import { ToolCallDisplay } from './ToolCallDisplay'

const meta: Meta<typeof ToolCallDisplay> = {
  title: 'Composites/ToolCallDisplay',
  component: ToolCallDisplay,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ToolCallDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    toolCall: {
      id: 'tool_1',
      name: 'write_file',
      args: { filename: 'research.md', content: 'Research content here...' },
      result: 'File created successfully',
      status: 'completed',
    },
  },
}

export const Pending: Story = {
  args: {
    toolCall: {
      id: 'tool_2',
      name: 'analyze_data',
      args: { dataset: 'user_metrics', filters: ['active_users', 'retention'] },
      result: null,
      status: 'pending',
    },
  },
}

export const Error: Story = {
  args: {
    toolCall: {
      id: 'tool_3',
      name: 'fetch_data',
      args: { url: 'https://api.example.com/data' },
      result: 'Connection timeout after 30 seconds',
      status: 'error',
    },
  },
}