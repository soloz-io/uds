import * as React from "react"
import { ChartContainer, ChartConfig } from "@/components/primitives/Chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/primitives/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/Select"
import { ToggleGroup, ToggleGroupItem } from "@/components/primitives/ToggleGroup"

export interface InteractiveChartProps {
  title: string
  description?: string
  data: unknown[]
  config: ChartConfig
  timeRanges?: { label: string; value: string }[]
  defaultTimeRange?: string
  children: React.ReactNode
  className?: string
}

export const InteractiveChart = React.memo<InteractiveChartProps>(
  ({ title, description, data, config, timeRanges, defaultTimeRange, children, className }) => {
    const [timeRange, setTimeRange] = React.useState(defaultTimeRange || timeRanges?.[0]?.value)

    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {timeRanges && timeRanges.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange}>
                    {timeRanges.map((range) => (
                      <ToggleGroupItem key={range.value} value={range.value} size="sm">
                        {range.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <div className="sm:hidden">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[300px] w-full">
            {children}
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }
)

InteractiveChart.displayName = "InteractiveChart"
