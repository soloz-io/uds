import * as React from "react"
import { Button } from "@/components/primitives/Button"
import { Badge } from "@/components/primitives/Badge"
import { cn } from "@/lib/utils"

/**
 * AgentIndicator Block
 *
 * A block component that displays agent working status with visual indicators.
 * Copied logic from reference SubAgentIndicator implementation.
 */

export interface SubAgent {
  id: string
  name: string
  subAgentName: string
  input: string | Record<string, unknown>
  output?: string | Record<string, unknown>
  status: "pending" | "active" | "completed" | "error" | "running" | "in_progress"
}

export interface AgentIndicatorProps {
  /**
   * Sub-agent data to display
   */
  subAgent: SubAgent
  /**
   * Click handler for agent selection
   */
  onClick: () => void
  /**
   * Whether this agent is currently selected
   */
  isSelected?: boolean
}

/**
 * AgentIndicator component - displays agent working status with visual indicators
 */
export const AgentIndicator = React.memo<AgentIndicatorProps>(
  ({ subAgent, onClick, isSelected = false }) => {
    const getStatusIcon = React.useCallback(() => {
      switch (subAgent.status) {
        case "completed":
          return "✅"
        case "error":
          return "❌"
        case "active":
          return "⚡"
        case "pending":
        default:
          return "⏳"
      }
    }, [subAgent.status])

    const getStatusVariant = React.useCallback(() => {
      switch (subAgent.status) {
        case "completed":
          return "default" as const
        case "error":
          return "destructive" as const
        case "active":
          return "secondary" as const
        case "pending":
        default:
          return "outline" as const
      }
    }, [subAgent.status])

    const inputDisplay = React.useMemo(() => {
      return typeof subAgent.input === "string"
        ? subAgent.input
        : JSON.stringify(subAgent.input)
    }, [subAgent.input])

    return (
      <Button
        variant={isSelected ? "default" : "ghost"}
        onClick={onClick}
        className={cn(
          "h-auto p-3 justify-start text-left",
          isSelected && "ring-2 ring-primary"
        )}
        aria-label={`View ${subAgent.subAgentName} details`}
      >
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm">{getStatusIcon()}</span>
            <Badge variant={getStatusVariant()} className="text-xs">
              {subAgent.subAgentName}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground text-left line-clamp-2">
            {inputDisplay}
          </p>
        </div>
      </Button>
    )
  }
)

AgentIndicator.displayName = "AgentIndicator"