import * as React from "react"
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanTrigger,
  PlanContent,
} from "@/components/ai-elements/plan"
import { ToolCallDisplay, type ToolCall } from "@/components/composites/ToolCallDisplay"
import { cn } from "@/lib/utils"
import { Streamdown } from "streamdown"

/**
 * SpecialistMessage Block
 *
 * A block component for displaying specialist agent messages with optional collapsible content.
 * Uses Plan AI element for consistent styling and optional space-efficient display.
 */

export interface SpecialistMessageData {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  content: string
  toolCalls?: ToolCall[]
  status: "pending" | "active" | "completed" | "error"
  avatarSrc?: string
  avatarName?: string
}

export interface SpecialistMessageProps {
  /**
   * Specialist message data to display
   */
  message: SpecialistMessageData
  /**
   * Whether this message is nested under an orchestrator
   */
  isNested?: boolean
  /**
   * Whether the specialist message should be open by default
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Whether to show collapse/expand trigger
   * @default false
   */
  collapsible?: boolean
}

/**
 * SpecialistMessage component - displays specialist agent messages with optional collapsible content
 */
export const SpecialistMessage = React.memo<SpecialistMessageProps>(
  ({ message, isNested = false, defaultOpen = false, collapsible = true }) => {
    const hasContent = React.useMemo(
      () => message.content && message.content.trim() !== "",
      [message.content]
    )
    const hasToolCalls = React.useMemo(
      () => message.toolCalls !== undefined && message.toolCalls.length > 0,
      [message.toolCalls]
    )

    return (
      <Plan
        defaultOpen={collapsible ? defaultOpen : true}
        className={cn(isNested && "ml-8")}
      >
        <PlanHeader>
          <div>
            <div className="mb-4 flex items-center gap-2">
              {message.icon && message.icon}
              <PlanTitle>{message.name}</PlanTitle>
            </div>
            {message.description && (
              <PlanDescription>{message.description}</PlanDescription>
            )}
          </div>
          {collapsible && <PlanTrigger />}
        </PlanHeader>

        <PlanContent>
          {/* Message content */}
          {hasContent && (
            <Streamdown
              className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              mode="static"
            >
              {message.content}
            </Streamdown>
          )}

          {/* Tool calls */}
          {hasToolCalls && (
            <div className={cn("space-y-2", hasContent && "mt-4")}>
              {message.toolCalls!.map((toolCall: ToolCall) => (
                <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
              ))}
            </div>
          )}
        </PlanContent>
      </Plan>
    )
  }
)

SpecialistMessage.displayName = "SpecialistMessage"
