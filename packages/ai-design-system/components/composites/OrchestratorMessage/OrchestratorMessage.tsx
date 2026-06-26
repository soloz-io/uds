import * as React from "react"
import {
  Message,
  MessageContent,
  MessageAvatar,
  MessageTypingIndicator,
} from "@/components/ai-elements/message"
import { Response } from "@/components/ai-elements/response"

/**
 * OrchestratorMessage Block
 *
 * A block component for displaying orchestrator/coordinator agent messages.
 * Accepts children components (SpecialistMessage and ToolCallDisplay) for composition.
 */

export interface OrchestratorMessageData {
  id: string
  content: string
  avatarSrc?: string
  avatarName?: string
  isLoading?: boolean
}

export interface OrchestratorMessageProps {
  /**
   * Orchestrator message data to display
   */
  message: OrchestratorMessageData
  /**
   * Whether to show avatar
   */
  showAvatar?: boolean
  /**
   * Child components (SpecialistMessage, ToolCallDisplay)
   */
  children?: React.ReactNode
}

/**
 * OrchestratorMessage component - displays coordinator messages with nested specialists and tools
 */
export const OrchestratorMessage = React.memo<OrchestratorMessageProps>(
  ({ message, showAvatar = true, children }) => {
    const hasContent = React.useMemo(
      () => message.content && message.content.trim() !== "",
      [message.content]
    )

    return (
      <Message from="assistant">
        {showAvatar && (
          <MessageAvatar
            src={message.avatarSrc}
            name={message.avatarName || "Coordinator"}
            iconName="bot"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Orchestrator's message content */}
          {message.isLoading ? (
            <MessageContent variant="contained" className="w-fit pr-6">
              <MessageTypingIndicator />
            </MessageContent>
          ) : hasContent && (
            <MessageContent variant="contained">
              <Response mode={message.isLoading ? "streaming" : "static"} isAnimating={!!message.isLoading}>{message.content}</Response>
            </MessageContent>
          )}

          {/* Child components (specialists and tool calls) */}
          {children && <div className="mt-4 space-y-4">{children}</div>}
        </div>
      </Message>
    )
  }
)

OrchestratorMessage.displayName = "OrchestratorMessage"
