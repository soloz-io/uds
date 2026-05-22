import * as React from "react"

import { StatsCard } from "@/components/composites/StatsCard"

export interface DashboardMetricItem {
  title: string
  value: string | number
  trend?: {
    direction: "up" | "down"
    value: string
  }
  footer?: {
    message: string
    description: string
  }
}

export interface DashboardMetricsProps {
  items: DashboardMetricItem[]
}

export const DashboardMetrics = React.memo<DashboardMetricsProps>(({ items }) => {
  return (
    <section className="px-4 lg:px-6">
      <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {items.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            trend={item.trend}
            footer={item.footer}
            className="@container/card basis-[calc((100%-3rem)/4)] min-w-[240px] shrink-0"
          />
        ))}
      </div>
    </section>
  )
})

DashboardMetrics.displayName = "DashboardMetrics"
