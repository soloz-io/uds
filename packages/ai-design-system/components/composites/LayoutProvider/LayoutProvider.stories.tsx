import type { Meta, StoryObj } from '@storybook/react'
import { LayoutProvider } from './LayoutProvider'

const meta = {
  title: 'Composites/LayoutProvider',
  component: LayoutProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LayoutProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
