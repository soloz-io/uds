import * as React from "react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/primitives/Avatar"
import { Icon } from "@/components/primitives/Icon"
import {
  Message,
  MessageContent,
  MessageAvatar,
  MessageTypingIndicator,
} from "@/components/ai-elements/message"
import { Response } from "@/components/composites/response"
import { cn } from "@/lib/utils"

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
   * Save the workspace as it stands after this reply.
   *
   * Sits here and not only in the toolbar because a snapshot is a point in the
   * CONVERSATION, not a global act: the reply is what tells the user something
   * is worth keeping, so the control belongs where they read that. It pairs
   * with the undo control on user messages — save beside what the agent
   * produced, undo beside what you asked for.
   *
   * Absent when there is nothing to save to, so the control simply does not
   * appear rather than offering an action that cannot work.
   */
  onSave?: () => void
  /** True once this version is kept — the control says so instead of repeating. */
  isSaved?: boolean
  /** A save is in flight. Refuses a second press: two presses is two snapshots. */
  isSaving?: boolean
  /**
   * Child components (SpecialistMessage, ToolCallDisplay)
   */
  children?: React.ReactNode
}

/**
 * OrchestratorMessage component - displays coordinator messages with nested specialists and tools
 */
export const OrchestratorMessage = React.memo<OrchestratorMessageProps>(
  ({ message, showAvatar = true, children, onSave, isSaved, isSaving }) => {
    const hasContent = React.useMemo(
      () => message.content && message.content.trim() !== "",
      [message.content]
    )

    return (
      <Message from="assistant" className="group">
        {showAvatar && (message.avatarSrc
          ? <MessageAvatar
              src={message.avatarSrc}
              name={message.avatarName || "Coordinator"}
            />
          : <Avatar className="size-8 ring-1 ring-border">
              <AvatarFallback>
                <Icon name="bot" />
              </AvatarFallback>
            </Avatar>
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

          {/* Revealed on hover or keyboard focus, like the undo control on a
              user message: keeping a version is deliberate and occasional, and
              a button standing on every reply reads as something you are
              expected to press. Hidden entirely while streaming — there is no
              settled version to keep yet. */}
          {onSave && !message.isLoading && (
            <button
              type="button"
              aria-label={isSaved ? "This version is already saved" : "Save this version"}
              title={isSaved ? "This version is already saved" : "Save this version"}
              disabled={isSaved || isSaving}
              onClick={onSave}
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
                "text-muted-foreground transition-opacity",
                "hover:bg-accent hover:text-foreground",
                "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSaved || isSaving ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                "disabled:pointer-events-none"
              )}
            >
              <Icon
                name={isSaved ? "check" : isSaving ? "loader-2" : "save"}
                size="sm"
                className={isSaving ? "animate-spin" : undefined}
                aria-hidden
              />
              {isSaved ? "Saved" : isSaving ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </Message>
    )
  }
)

OrchestratorMessage.displayName = "OrchestratorMessage"
