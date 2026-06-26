import type { Meta, StoryObj } from '@storybook/react'
import { LoadingShimmer } from './LoadingShimmer'

const meta = {
  title: 'Composites/LoadingShimmer',
  component: LoadingShimmer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoadingShimmer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
