import type { Meta, StoryObj } from '@storybook/react'
import { StatsCard } from './StatsCard'

const meta = {
  title: 'Composites/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  parameters: { 
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$1,250.00',
  },
}

export const WithTrendUp: Story = {
  args: {
    title: 'Total Revenue',
    value: '$1,250.00',
    trend: { direction: 'up', value: '+12.5%' },
    footer: {
      message: 'Trending up this month',
      description: 'Visitors for the last 6 months',
    },
  },
}

export const WithTrendDown: Story = {
  args: {
    title: 'New Customers',
    value: '1,234',
    trend: { direction: 'down', value: '-20%' },
    footer: {
      message: 'Down 20% this period',
      description: 'Acquisition needs attention',
    },
  },
}

export const Complete: Story = {
  args: {
    title: 'Active Accounts',
    value: '45,678',
    trend: { direction: 'up', value: '+12.5%' },
    footer: {
      message: 'Strong user retention',
      description: 'Engagement exceed targets',
    },
  },
}

export const GrowthRate: Story = {
  args: {
    title: 'Growth Rate',
    value: '4.5%',
    trend: { direction: 'up', value: '+4.5%' },
    footer: {
      message: 'Steady performance increase',
      description: 'Meets growth projections',
    },
  },
}
