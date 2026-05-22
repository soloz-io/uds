import type { Meta, StoryObj } from '@storybook/react'
import { InteractiveChart } from './InteractiveChart'
import { AreaChart, Area, XAxis, CartesianGrid } from 'recharts'
import type { ChartConfig } from '@/components/primitives/Chart'

const meta = {
  title: 'Composites/InteractiveChart',
  component: InteractiveChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InteractiveChart>

export default meta
type Story = StoryObj<typeof meta>

const chartData = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

const chartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig

export const Default: Story = {
  args: {
    title: 'Area Chart',
    description: 'Showing total visitors for the last 6 months',
    data: chartData,
    config: chartConfig,
    timeRanges: [
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' },
      { label: '90D', value: '90d' },
    ],
    defaultTimeRange: '30d',
    children: (
      <AreaChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <Area dataKey="desktop" type="monotone" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
      </AreaChart>
    ),
  },
}
