import * as React from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

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
  /** Optional point identity, passed back by `onPointClick`. */
  id?: string
  /** Optional colour of this point's dot on the main series (e.g. green for better, red for worse). */
  color?: string
  /** Optional emphasis: the dot is drawn larger, with a ring. */
  emphasized?: boolean
  /** Optional heading for this point's tooltip, in place of its date. */
  label?: string
  /** Optional x-axis tick, used when the axis is "sequence". */
  tick?: string
}

export type DashboardChartTimeRange = string;

export interface DashboardChartProps {
  series: DashboardChartPoint[]
  timeRange?: DashboardChartTimeRange
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
  /** Called when a point of the main series is clicked; makes points clickable. */
  onPointClick?: (point: DashboardChartPoint) => void
  /** The id of the point shown as selected. */
  selectedPointId?: string | null
  /** Optional value range of the y axis, e.g. ["dataMin - 2", "dataMax + 2"] to show small differences; default from 0. */
  yDomain?: [number | string, number | string]
  /** Whether the area under each line is filled. Defaults to true. */
  filled?: boolean
  /** Optional colour of the second series; defaults to the primary colour. */
  mobileColor?: string
  /** "time" (default) places points by date; "sequence" places them one after another, in order, labelled by `tick`. */
  xAxis?: "time" | "sequence"
}

interface DashboardTooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
  [key: string]: unknown;
}

const DashboardTooltipContent = React.memo((props: {
  active?: boolean;
  payload?: DashboardTooltipPayloadItem[];
  label?: string;
  desktopLabel?: string;
  mobileLabel?: string;
  [key: string]: unknown;
}): React.ReactElement | null => {
  const { active, payload, desktopLabel, mobileLabel, content: _content, label, ...rest } = props;
  void _content;
  if (!active || !payload?.length) return null;

  const uniquePayload = payload.filter(
    (item: DashboardTooltipPayloadItem, index: number, self: DashboardTooltipPayloadItem[]) =>
      index === self.findIndex((t: DashboardTooltipPayloadItem) => String(t.dataKey) === String(item.dataKey)),
  );
  
  return (
    <ChartTooltipContent
      {...rest}
      active={active}
      label={label as string}
      payload={uniquePayload}
      labelFormatter={(value, tooltipPayload) => {
        const typedPayload = tooltipPayload as Array<{ payload: { timestamp?: number; label?: string } }>;
        if (typedPayload?.[0]?.payload?.label) return typedPayload[0].payload.label;
        const timestamp = typedPayload?.[0]?.payload?.timestamp;
        if (!timestamp) return null;
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return ""
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      }}
      formatter={(value, name, item, index, tooltipPayload) => {
        const typedPayload = tooltipPayload as { timestamp?: number };
        const typedItem = item as { color?: string };
        const labelText = name === "desktop" ? desktopLabel : (name === "mobile" ? mobileLabel : name);
        const timeStr = typedPayload?.timestamp ? new Date(typedPayload.timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit"
        }) : null;
        
        return (
          <div className="flex flex-col w-full">
            <div className="flex w-full items-center gap-2">
              <div 
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]" 
                style={{ backgroundColor: typedItem.color }} 
              />
              <div className="flex flex-1 justify-between items-center gap-4">
                <span className="text-muted-foreground">{labelText as React.ReactNode}</span>
                <span className="font-mono font-medium tabular-nums text-foreground">{value as React.ReactNode}</span>
              </div>
            </div>
            {timeStr && (
              <div className="text-[10px] text-muted-foreground self-end mt-0.5">
                {timeStr}
              </div>
            )}
          </div>
        )
      }}
      indicator="dot"
    />
  );
});
DashboardTooltipContent.displayName = "DashboardTooltipContent";

const CustomDot = React.memo((props: {
  cx?: number;
  cy?: number;
  stroke?: string;
  payload?: DashboardChartPoint;
  onPointClick?: (point: DashboardChartPoint) => void;
  selectedPointId?: string | null;
  /** Draws the point's own colour and emphasis; only the main series does. */
  styled?: boolean;
}): React.ReactElement => {
  const { cx, cy, stroke, onPointClick, selectedPointId, styled } = props;
  const payload = styled ? props.payload : undefined;
  const color = payload?.color ?? stroke;
  const selected = payload?.id != null && payload.id === selectedPointId;
  const clickable = Boolean(onPointClick && payload);
  return (
    <g
      onClick={clickable ? () => onPointClick!(payload!) : undefined}
      style={clickable ? { cursor: "pointer" } : undefined}
      pointerEvents={clickable ? "all" : "none"}
    >
      {(payload?.emphasized || selected) && (
        <circle cx={cx} cy={cy} r={9} fill="none" stroke={color} strokeWidth={selected ? 2 : 1} strokeOpacity={selected ? 1 : 0.6} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={payload?.emphasized ? 6 : 4}
        fill={payload?.color ?? "var(--background)"}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
});
CustomDot.displayName = "CustomDot";

export const DashboardChart = React.memo<DashboardChartProps>(({ 
  series, 
  timeRange: propsTimeRange,
  onTimeRangeChange,
  title,
  description,
  shortDescription,
  timeRanges,
  desktopLabel,
  mobileLabel,
  showMobile,
  className,
  chartClassName,
  onPointClick,
  selectedPointId,
  yDomain,
  filled = true,
  mobileColor,
  xAxis = "time",
}) => {
  const [localTimeRange, setLocalTimeRange] = React.useState<DashboardChartTimeRange>(timeRanges[0]?.value)
  const timeRange = propsTimeRange ?? localTimeRange

  const handleTimeRangeChange = React.useCallback(
    (range: DashboardChartTimeRange) => {
      setLocalTimeRange(range)
      onTimeRangeChange?.(range)
    },
    [onTimeRangeChange]
  )

  const filteredSeries = React.useMemo(() => {
    // 1. Sort ascending chronologically (oldest to newest)
    const sortedSeries = [...series].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const referenceDate = sortedSeries.length > 0 ? sortedSeries[sortedSeries.length - 1].date : new Date().toISOString()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }

    let filtered = sortedSeries;
    if (timeRange === "10" || timeRange === "20" || timeRange === "30") {
      // Special logic for count-based limits if passed as timeRange
      const limit = parseInt(timeRange, 10)
      filtered = sortedSeries.slice(-limit)
    } else {
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      filtered = sortedSeries.filter(item => new Date(item.date) >= startDate)
    }

    // In sequence, points keep the order given.
    if (xAxis === "sequence") {
      const limit = parseInt(timeRange, 10)
      const kept = Number.isFinite(limit) ? series.slice(-limit) : series
      return kept.map((item, i) => ({ ...item, index: i, timestamp: new Date(item.date).getTime() }))
    }
    return filtered.map(item => ({ ...item, timestamp: new Date(item.date).getTime() }))
  }, [series, timeRange, xAxis])

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
              ...(showMobile ? { mobile: { label: mobileLabel, color: mobileColor ?? "var(--primary)" } } : {}),
            }}
            className={cn("aspect-auto w-full", chartClassName || "h-[250px]")}
          >
            <ComposedChart data={filteredSeries}>
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
              {xAxis === "sequence" ? (
                <XAxis
                  dataKey="index"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  padding={{ left: 24, right: 24 }}
                  tickFormatter={(i) => (filteredSeries[i as number] as DashboardChartPoint | undefined)?.tick ?? String(i)}
                />
              ) : (
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })
                }}
              />
              )}
              {yDomain && <YAxis hide domain={yDomain} />}
              <ChartTooltip
                cursor={false}
                content={
                  <DashboardTooltipContent 
                    desktopLabel={desktopLabel} 
                    mobileLabel={mobileLabel} 
                  />
                }
              />
              {showMobile && (
                <>
                  {filled && (
                    <Area
                      dataKey="mobile"
                      type="monotone"
                      fill="url(#fillMobile)"
                      stroke="none"
                    />
                  )}
                  <Line
                    dataKey="mobile"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={<CustomDot />}
                    activeDot={{ r: 6 }}
                  />
                </>
              )}
              {filled && (
                <Area
                  dataKey="desktop"
                  type="monotone"
                  fill="url(#fillDesktop)"
                  stroke="none"
                />
              )}
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={<CustomDot styled onPointClick={onPointClick} selectedPointId={selectedPointId} />}
                activeDot={onPointClick ? false : { r: 6 }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
})

DashboardChart.displayName = "DashboardChart"
