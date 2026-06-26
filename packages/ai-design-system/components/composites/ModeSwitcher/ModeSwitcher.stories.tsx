import type { Meta, StoryObj } from '@storybook/react'
import { ModeSwitcher } from './ModeSwitcher'

const meta = {
  title: 'Composites/ModeSwitcher',
  component: ModeSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ModeSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
