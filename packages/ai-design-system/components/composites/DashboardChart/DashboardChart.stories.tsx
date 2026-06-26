import type { Meta, StoryObj } from '@storybook/react'
import { DashboardChart } from './DashboardChart'

const meta = {
  title: 'Composites/DashboardChart',
  component: DashboardChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DashboardChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
