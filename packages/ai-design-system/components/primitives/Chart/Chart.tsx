import * as React from "react"
import {
  ChartContainer as ShadcnChartContainer,
  ChartTooltip as ShadcnChartTooltip,
  ChartTooltipContent as ShadcnChartTooltipContent,
  ChartLegend as ShadcnChartLegend,
  ChartLegendContent as ShadcnChartLegendContent,
  ChartStyle as ShadcnChartStyle,
} from "../../ui/chart"
import type { ChartConfig } from "../../ui/chart"

/**
 * Chart Primitive
 *
 * A foundational chart component that wraps shadcn/ui Chart with design system
 * enhancements. This primitive serves as the single source of truth for all data
 * visualizations across the application.
 *
 * @example
 * ```tsx
 * const chartConfig = {
 *   desktop: { label: "Desktop", color: "var(--chart-1)" },
 *   mobile: { label: "Mobile", color: "var(--chart-2)" },
 * }
 *
 * <ChartContainer config={chartConfig}>
 *   <BarChart data={data}>
 *     <Bar dataKey="desktop" fill="var(--color-desktop)" />
 *     <Bar dataKey="mobile" fill="var(--color-mobile)" />
 *   </BarChart>
 * </ChartContainer>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/chart - shadcn/ui Chart documentation
 */

/**
 * ChartContainer component props
 */
export type ChartContainerProps = React.ComponentProps<typeof ShadcnChartContainer>

/**
 * ChartContainer component
 *
 * Container for chart components with configuration and theming.
 */
export const ChartContainer = React.memo(
  React.forwardRef<HTMLDivElement, ChartContainerProps>((props, ref) => {
    return <ShadcnChartContainer ref={ref} {...props} />
  })
)

ChartContainer.displayName = "ChartContainer"

/**
 * ChartTooltip component
 *
 * Tooltip component for charts from Recharts.
 */
export const ChartTooltip = ShadcnChartTooltip

/**
 * ChartTooltipContent component props
 */
export type ChartTooltipContentProps = React.ComponentProps<typeof ShadcnChartTooltipContent>

/**
 * ChartTooltipContent component
 *
 * Styled tooltip content for charts.
 */
export const ChartTooltipContent = React.memo(
  React.forwardRef<HTMLDivElement, ChartTooltipContentProps>((props, ref) => {
    return <ShadcnChartTooltipContent ref={ref} {...props} />
  })
)

ChartTooltipContent.displayName = "ChartTooltipContent"

/**
 * ChartLegend component
 *
 * Legend component for charts from Recharts.
 */
export const ChartLegend = ShadcnChartLegend

ChartLegend.displayName = "ChartLegend"

/**
 * ChartLegendContent component props
 */
export type ChartLegendContentProps = React.ComponentProps<typeof ShadcnChartLegendContent>

/**
 * ChartLegendContent component
 *
 * Styled legend content for charts.
 */
export const ChartLegendContent = React.memo(
  React.forwardRef<HTMLDivElement, ChartLegendContentProps>((props, ref) => {
    return <ShadcnChartLegendContent ref={ref} {...props} />
  })
)

ChartLegendContent.displayName = "ChartLegendContent"

/**
 * ChartStyle component
 *
 * Internal component for injecting chart color styles.
 */
export const ChartStyle = ShadcnChartStyle

/**
 * Re-export ChartConfig type for chart configuration
 */
export type { ChartConfig }
