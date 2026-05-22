import type { Meta, StoryObj } from '@storybook/react'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from './Chart'
import type { ChartConfig } from './Chart'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'

/**
 * Chart Primitive Stories
 *
 * The Chart component is a foundational primitive for data visualizations.
 * It extends shadcn/ui's Chart with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Built on Recharts for powerful visualizations
 * - Automatic theming with design tokens
 * - Responsive container
 * - Accessible tooltips and legends
 * - Dark mode support
 *
 * ## Accessibility
 * - Proper ARIA labels for charts
 * - Keyboard navigation support
 * - Screen reader compatible tooltips
 * - Color-blind friendly palettes
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use ChartConfig to define data series
 * - Provide meaningful labels
 * - Use appropriate chart types for data
 * - Include tooltips for data points
 *
 * ### Don'ts
 * - Don't use too many data series
 * - Don't omit axis labels
 * - Don't use charts for simple data
 * - Don't rely solely on color to convey meaning
 */
const meta = {
  title: 'Primitives/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A chart component for data visualizations, built on Recharts and shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

/**
 * Bar Chart
 *
 * Basic bar chart with two data series.
 */
export const BarChartExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} style={{ minHeight: '300px', width: '100%' }}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A bar chart comparing desktop and mobile usage across months.',
      },
    },
  },
}

/**
 * Line Chart
 *
 * Line chart showing trends over time.
 */
export const LineChartExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} style={{ minHeight: '300px', width: '100%' }}>
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A line chart showing trends in desktop and mobile usage.',
      },
    },
  },
}

/**
 * Area Chart
 *
 * Area chart with filled regions.
 */
export const AreaChartExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} style={{ minHeight: '300px', width: '100%' }}>
      <AreaChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="desktop"
          type="monotone"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
        <Area
          dataKey="mobile"
          type="monotone"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
        />
      </AreaChart>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An area chart with filled regions showing cumulative data.',
      },
    },
  },
}

/**
 * With Y Axis
 *
 * Chart with both X and Y axes.
 */
export const WithYAxis: Story = {
  render: () => (
    <ChartContainer config={chartConfig} style={{ minHeight: '300px', width: '100%' }}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart with Y axis for better value reference.',
      },
    },
  },
}

/**
 * Single Series
 *
 * Chart with a single data series.
 */
export const SingleSeries: Story = {
  render: () => {
    const singleConfig = {
      desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
      },
    } satisfies ChartConfig

    return (
      <ChartContainer config={singleConfig} style={{ minHeight: '300px', width: '100%' }}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        </BarChart>
      </ChartContainer>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with a single data series for simpler visualizations.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * Charts in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'hsl(var(--foreground))' }}>
          Bar Chart
        </h3>
        <ChartContainer config={chartConfig} style={{ minHeight: '250px', width: '100%' }}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'hsl(var(--foreground))' }}>
          Line Chart
        </h3>
        <ChartContainer config={chartConfig} style={{ minHeight: '250px', width: '100%' }}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Charts automatically adapt to dark mode with appropriate contrast and visibility.',
      },
    },
    backgrounds: { disable: true },
  },
}
