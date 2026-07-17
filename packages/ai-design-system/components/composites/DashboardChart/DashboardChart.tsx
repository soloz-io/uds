import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/primitives/Chart"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/Card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select"
import { ToggleGroup, ToggleGroupItem } from "@/components/primitives/ToggleGroup"
import { cn } from "@/lib/utils"

export interface DashboardChartPoint {
  date: string
  desktop: number
  mobile: number
}

export type DashboardChartTimeRange = string

export interface DashboardChartProps {
  series: DashboardChartPoint[]
  onTimeRangeChange?: (range: DashboardChartTimeRange) => void
  title: string
  description: string
  shortDescription: string
  timeRanges: { value: string, label: string, shortLabel?: string }[]
  desktopLabel: string
  mobileLabel: string
  showMobile: boolean
  className?: string
  chartClassName?: string
}

export const DashboardChart = React.memo<DashboardChartProps>(({ 
  series, 
  onTimeRangeChange,
  title,
  description,
  shortDescription,
  timeRanges,
  desktopLabel,
  mobileLabel,
  showMobile,
  className,
  chartClassName
}) => {
  const [timeRange, setTimeRange] = React.useState<DashboardChartTimeRange>(timeRanges[0]?.value)

  const handleTimeRangeChange = React.useCallback(
    (range: DashboardChartTimeRange) => {
      setTimeRange(range)
      onTimeRangeChange?.(range)
    },
    [onTimeRangeChange]
  )

  const filteredSeries = React.useMemo(() => {
    const referenceDate = series.length > 0 ? series[series.length - 1].date : new Date().toISOString()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    } else if (timeRange === "10" || timeRange === "20" || timeRange === "30") {
      // Special logic for count-based limits if passed as timeRange
      const limit = parseInt(timeRange, 10)
      return series.slice(-limit)
    }

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return series.filter(item => new Date(item.date) >= startDate)
  }, [series, timeRange])

  return (
    <section className={cn("px-4 lg:px-6 flex flex-col h-full", className)}>
      <Card className="@container/card flex flex-col flex-1 min-h-0 border-0 shadow-none bg-transparent">
        <CardHeader className="shrink-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">{description}</span>
            <span className="@[540px]/card:hidden">{shortDescription}</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {
                if (value) {
                  handleTimeRangeChange(value as DashboardChartTimeRange)
                }
              }}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              {timeRanges.map(range => (
                <ToggleGroupItem key={range.value} value={range.value}>{range.label}</ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Select value={timeRange} onValueChange={(value) => handleTimeRangeChange(value as DashboardChartTimeRange)}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                aria-label="Select a value"
              >
                <SelectValue placeholder={timeRanges[0]?.label || "Select range"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value} className="rounded-lg">
                    {range.shortLabel || range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 min-h-0 flex flex-col">
          <ChartContainer
            config={{
              desktop: { label: desktopLabel, color: "var(--primary)" },
              ...(showMobile ? { mobile: { label: mobileLabel, color: "var(--primary)" } } : {}),
            }}
            className={cn("aspect-auto w-full", chartClassName || "h-[250px]")}
          >
            <AreaChart data={filteredSeries}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1} />
                  <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                </linearGradient>
                {showMobile && (
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(String(value)).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              {showMobile && (
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
              )}
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
})

DashboardChart.displayName = "DashboardChart"
