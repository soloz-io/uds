import type { Meta, StoryObj } from '@storybook/react'
import { DashboardHeader } from './DashboardHeader'

const meta = {
  title: 'Composites/DashboardHeader',
  component: DashboardHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DashboardHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
