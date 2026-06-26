import type { Meta, StoryObj } from '@storybook/react'
import { TriggerNode } from './TriggerNode'

const meta = {
  title: 'Composites/TriggerNode',
  component: TriggerNode,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TriggerNode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
