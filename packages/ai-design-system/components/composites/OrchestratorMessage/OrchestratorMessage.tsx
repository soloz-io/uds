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

export interface OrchestratorQuestionOption {
  id?: string
  label: string
  url?: string
  description?: string
  selected?: boolean
}

export interface OrchestratorQuestionData {
  /** Label tag, defaults to "QUESTION" */
  label?: string
  /** Timestamp displayed on the right, e.g. "11:12" */
  timestamp?: string
  /** The question prompt to display */
  question: string
  /** List of selectable options */
  options?: (string | OrchestratorQuestionOption)[]
  /** Answered/selected option label (if settled) */
  answer?: string
  /** Callback when an option is clicked */
  onSelectOption?: (option: string | OrchestratorQuestionOption) => void
  /** Disabled state for options */
  disabled?: boolean
}

export interface OrchestratorMessageData {
  id: string
  content: string
  avatarSrc?: string
  avatarName?: string
  isLoading?: boolean
  timestamp?: string
  question?: OrchestratorQuestionData
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
   * Optional question data override
   */
  question?: OrchestratorQuestionData
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
  ({ message, showAvatar = true, question: questionProp, children, onSave, isSaved, isSaving }) => {
    const question = questionProp ?? message.question
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

          {/* AI Question Card (media_1791439182453.png) */}
          {question && (
            <div className={cn("w-full text-left", hasContent && "mt-3")}>
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <span>{question.label ?? "QUESTION"}</span>
                {question.timestamp && <span className="normal-case tracking-normal">{question.timestamp}</span>}
              </div>
              <div className="mt-2 text-sm sm:text-base font-semibold text-foreground">
                {question.question}
              </div>
              {question.options && question.options.length > 0 && (
                <div className="mt-3 rounded-xl border border-border/60 divide-y divide-border/60 overflow-hidden bg-card/20">
                  {question.options.map((opt, i) => {
                    const label = typeof opt === "string" ? opt : opt.label
                    const url = typeof opt === "object" ? opt.url : undefined
                    const isInteractive = Boolean(question.onSelectOption && !question.disabled)

                    return (
                      <div
                        key={typeof opt === "object" && opt.id ? opt.id : `${label}-${i}`}
                        onClick={isInteractive ? () => question.onSelectOption!(opt) : undefined}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 text-sm font-normal text-foreground transition-colors",
                          isInteractive && "cursor-pointer hover:bg-accent/40"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {url && (
                            <img
                              src={url}
                              alt={label}
                              className="size-8 rounded object-cover shrink-0"
                            />
                          )}
                          <span className="truncate">{label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
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
