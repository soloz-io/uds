import * as React from "react"
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message"

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
            src={message.avatarSrc || "/coordinator-avatar.png"}
            name={message.avatarName || "Coordinator"}
          />
        )}

        <div className="flex-1">
          {/* Orchestrator's message content */}
          {hasContent && (
            <MessageContent variant="contained">
              {message.content}
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
