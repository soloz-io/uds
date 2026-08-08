import * as React from "react"
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
} from "@/components/ai-elements/tool"
import { ToolCallDisplay, type ToolCall } from "@/components/composites/ToolCallDisplay"
import { cn } from "@/lib/utils"
import { Response } from "@/components/composites/response"

/**
 * SpecialistMessage Block
 *
 * A block component for displaying specialist agent messages with optional collapsible content.
 * Uses Tool AI element for consistent styling with tool calls.
 */

export interface SpecialistMessageData {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  content: string
  toolCalls?: ToolCall[]
  status: "pending" | "active" | "completed" | "error" | "running" | "in_progress"
  avatarSrc?: string
  avatarName?: string
  input?: string | Record<string, unknown>
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
    const [isOpen, setIsOpen] = React.useState(collapsible ? defaultOpen : true)

    const hasContent = React.useMemo(
      () => message.content && message.content.trim() !== "",
      [message.content]
    )
    const hasToolCalls = React.useMemo(
      () => message.toolCalls !== undefined && message.toolCalls.length > 0,
      [message.toolCalls]
    )

    const toolState = React.useMemo(() => {
      switch (message.status) {
        case "pending":
          return "input-streaming" as const
        case "active":
          return "input-available" as const
        case "completed":
          return "output-available" as const
        case "error":
          return "output-error" as const
        default:
          return "output-available" as const
      }
    }, [message.status])

    return (
      <Tool
        open={isOpen}
        onOpenChange={collapsible ? setIsOpen : undefined}
      >
        <ToolHeader
          title={message.name}
          type={`tool-${message.name}` as const}
          state={toolState}
        />

        <ToolContent>
          <div className="p-4 pt-0 flex flex-col gap-4">
            {message.input && (
              <ToolInput 
                input={typeof message.input === 'string' ? { task: message.input } : message.input} 
                className="p-0" 
              />
            )}

            {/* Message content */}
            {hasContent && (
              <Response
                className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                mode={message.status === "active" ? "streaming" : "static"}
                isAnimating={message.status === "active"}
              >
                {message.content}
              </Response>
            )}

            {/* Tool calls */}
            {hasToolCalls && (
              <div className={cn("space-y-2", hasContent && "mt-4")}>
                {message.toolCalls!.map((toolCall: ToolCall) => (
                  <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
                ))}
              </div>
            )}
          </div>
        </ToolContent>
      </Tool>
    )
  }
)

SpecialistMessage.displayName = "SpecialistMessage"
