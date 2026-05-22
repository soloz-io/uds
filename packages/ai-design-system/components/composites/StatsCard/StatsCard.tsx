import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/primitives/Card"
import { Badge } from "@/components/primitives/Badge"
import { Icon } from "@/components/primitives/Icon"

export interface StatsCardProps {
  /**
   * Card title (e.g., "Total Revenue")
   */
  title: string
  /**
   * Main value to display (e.g., "$1,250.00")
   */
  value: string | number
  /**
   * Trend indicator with direction and percentage
   */
  trend?: {
    direction: "up" | "down"
    value: string
  }
  /**
   * Footer content with primary message and secondary description
   */
  footer?: {
    message: string
    description: string
  }
  /**
   * Additional CSS classes
   */
  className?: string
}

export const StatsCard = React.memo<StatsCardProps>(
  ({ title, value, trend, footer, className }) => {
    return (
      <Card className={className}>
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value}
          </CardTitle>
          {trend && (
            <CardAction>
              <Badge variant="outline">
                <Icon
                  name={trend.direction === "up" ? "arrow-right" : "arrow-left"}
                />
                {trend.value}
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        {footer && (
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span>{footer.message}</span>
              {trend && (
                <Icon
                  name={trend.direction === "up" ? "arrow-right" : "arrow-left"}
                  className="size-4"
                />
              )}
            </div>
            <div className="text-muted-foreground">{footer.description}</div>
          </CardFooter>
        )}
      </Card>
    )
  }
)

StatsCard.displayName = "StatsCard"
