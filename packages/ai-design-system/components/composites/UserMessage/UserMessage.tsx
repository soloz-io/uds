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
} from "@/components/ai-elements/message"
import { renderMediaOutput } from "@/components/composites/SystemMessage"
import { cn } from "@/lib/utils"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/HoverCard"

/**
 * UserMessage Block
 *
 * A simple block component for displaying user messages.
 * Uses Message AI element with right-alignment.
 */

/**
 * Display-only attachment shape — deliberately loose (string `kind`/`type`,
 * not an app-specific union) so this stays app-agnostic, mirroring
 * ChatSubmitInput's own attachment shape on the submit side. `source.value`
 * is used directly as an <img> src: it works whether it's a `data:` URI
 * (optimistic pre-upload bubble) or a resolved https:// object-store URL
 * (after persistence/reload) — no branching needed at render time.
 */
export interface UserMessageAttachment {
  id?: string
  kind: string
  mime: string
  filename?: string
  source: { type: string; value: string }
  title?: string
  description?: string
  icon?: React.ReactNode
  badge?: { label: string; icon?: React.ReactNode } | string
  thumbnailUrl?: string
}

export interface UserMessageSelection {
  /** The question prompt that was answered */
  question: string
  /** The user's selected option or write-in text */
  answer?: string
  /** Number of questions answered (defaults to 1) */
  count?: number
  /** Custom header label overriding "1 question" */
  label?: string
}

export interface UserMessageData {
  id: string
  content: string
  avatarSrc?: string
  avatarName?: string
  attachments?: UserMessageAttachment[]
  /**
   * Set when this request's own turn was saved AND an earlier restore point
   * exists to go back to. Using the control undoes the request — it and
   * everything it produced are removed, and the text returns to the prompt
   * input to be sent again.
   *
   * It belongs on the request, not on the answer: "take me back to here" is
   * something a person means about what they asked for, and offering it under
   * an assistant reply asks them to work out which reply corresponds to which
   * of their own messages.
   */
  checkpointId?: string
  /**
   * What using the control will actually do, named rather than implied: which
   * saved version it returns to, and how many requests that removes.
   *
   * A restore cuts back to the previous snapshot, so turns between this one and
   * that point go too — they were never saved and have no snapshot of their own
   * to stop at. That is not guessable from the control's position, so it is
   * stated before the click rather than discovered after it.
   */
  restoreLabel?: string
  /**
   * Answered question selection card display (e.g. from an ask_user / question response)
   */
  selection?: UserMessageSelection
}

function UserMessageAttachments({ attachments }: { attachments: UserMessageAttachment[] }) {
  const images = attachments.filter((a) => a.mime.startsWith("image/"))
  const audio = attachments.filter((a) => a.mime.startsWith("audio/"))
  const items = attachments.filter(
    (a) =>
      a.kind === "item" ||
      a.mime === "application/x-item" ||
      Boolean(a.title || a.description)
  )
  if (images.length === 0 && audio.length === 0 && items.length === 0) return null

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {items.map((item, i) => {
        const itemIcon = item.icon ?? <Icon name="file" size="xs" />
        const badgeLabel = typeof item.badge === "string" ? item.badge : item.badge?.label
        const badgeIcon =
          typeof item.badge === "object" && item.badge?.icon ? (
            item.badge.icon
          ) : (
            <Icon name="shield-check" size="xs" />
          )
        const displayTitle = item.title || item.filename || "Item"

        const chip = (
          <div
            key={item.id ?? `${displayTitle}-${i}`}
            className="group relative inline-flex h-7 select-none items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary data-[state=open]:border-primary data-[state=open]:text-primary cursor-pointer"
          >
            <span className="shrink-0 flex items-center justify-center text-inherit">
              {itemIcon}
            </span>
            <span className="truncate max-w-[200px]">{displayTitle}</span>
          </div>
        )

        if (!item.description && !item.title && !item.badge && !item.thumbnailUrl) {
          return chip
        }

        return (
          <HoverCard key={item.id ?? `${displayTitle}-${i}`} openDelay={150} closeDelay={100}>
            <HoverCardTrigger asChild>{chip}</HoverCardTrigger>
            <HoverCardContent
              side="top"
              align="end"
              sideOffset={8}
              className="w-72 rounded-xl border border-border bg-popover p-3.5 shadow-xl text-popover-foreground text-left"
            >
              <div className="flex flex-col gap-2">
                {item.thumbnailUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.thumbnailUrl}
                      alt={displayTitle}
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start gap-2">
                  {itemIcon && (
                    <div className="size-5 shrink-0 text-foreground flex items-center justify-center pt-0.5">
                      {itemIcon}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-sm font-semibold text-foreground tracking-tight">
                      {displayTitle}
                    </span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
                {badgeLabel && (
                  <div className="pt-0.5 flex items-center">
                    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground border border-border/50">
                      {badgeIcon}
                      <span>{badgeLabel}</span>
                    </span>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        )
      })}
      {images.map((a, i) => (
        <a
          key={a.id ?? `${a.filename ?? "attachment"}-${i}`}
          href={a.source.value}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "block size-20 shrink-0 overflow-hidden rounded-md border border-border",
            "transition-opacity hover:opacity-90"
          )}
        >
          <img
            src={a.source.value}
            alt={a.filename || "Attached image"}
            className="size-full object-cover"
          />
        </a>
      ))}
      {audio.map((a, i) => (
        <div
          key={a.id ?? `${a.filename ?? "voice-note"}-${i}`}
          className="shrink-0 rounded-md border border-border p-1.5 w-[280px] sm:w-[320px] max-w-full"
        >
          {renderMediaOutput(a.source.value, a.mime)}
        </div>
      ))}
    </div>
  )
}

export interface UserMessageProps {
  /**
   * User message data to display
   */
  message: UserMessageData
  /**
   * Whether to show avatar
   */
  showAvatar?: boolean
  /**
   * Rewind to this message's checkpoint. The control renders only when both
   * this and `message.checkpointId` are present.
   *
   * The checkpoint it carries is the restore point BEFORE this request, not the
   * snapshot saved on this turn's own reply. That snapshot captured the
   * workspace once the request had already run, so restoring it would undo
   * nothing; the state to come back to is the one the request was made from.
   * `message.restoreLabel` names it, because the control's position cannot.
   */
  onRestore?: (messageId: string, checkpointId: string) => void
}

/**
 * UserMessage component - displays user messages with right alignment
 */
export const UserMessage = React.memo<UserMessageProps>(
  ({ message, showAvatar = true, onRestore }) => {
    const canRestore = Boolean(message.checkpointId && onRestore)
    // The generic wording is a fallback, not the intended text: without a label
    // the control cannot say which version it returns to or how much it removes.
    const restoreLabel =
      message.restoreLabel ?? "Undo this request and go back to the last saved version"

    return (
      <Message from="user" className="group">
        {showAvatar && (message.avatarSrc
          ? <MessageAvatar
              src={message.avatarSrc}
              name={message.avatarName || "User"}
            />
          : <Avatar className="size-8 ring-1 ring-border">
              <AvatarFallback>
                <Icon name="user" />
              </AvatarFallback>
            </Avatar>
        )}
        <div className="flex flex-col items-end gap-2 flex-1 min-w-0">
          {message.attachments && message.attachments.length > 0 && (
            <UserMessageAttachments attachments={message.attachments} />
          )}
          <div className="flex items-center gap-1 max-w-[80%]">
            {/* Left of the bubble, so it sits on the inside edge of a
                right-aligned message instead of pushing into the margin.

                Visible at rest, dimmed, and full strength on hover or keyboard
                focus. It marks the requests that CAN be undone, which is a
                sparse and non-obvious set — only turns that were saved and have
                an earlier restore point to return to. Hiding it until hover made
                that set undiscoverable: the page showed nothing on any message,
                so a save appeared to have produced no control at all and the
                only way to find one was to sweep the pointer down the
                conversation. */}
            {canRestore && (
              <button
                type="button"
                aria-label={restoreLabel}
                title={restoreLabel}
                onClick={() => onRestore!(message.id, message.checkpointId!)}
                className={cn(
                  "shrink-0 rounded-md p-1 text-muted-foreground opacity-40 transition-opacity",
                  "hover:bg-accent hover:text-foreground hover:opacity-100",
                  "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring group-hover:opacity-100"
                )}
              >
                <Icon name="undo-2" size="sm" aria-hidden />
              </button>
            )}
            {message.selection ? (
              <div className="w-full max-w-lg rounded-xl border border-border/60 divide-y divide-border/60 overflow-hidden bg-card/20 text-left">
                <div className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Icon name="message-square-question" size="sm" className="size-3.5 shrink-0" aria-hidden />
                    <span>
                      {message.selection.label ??
                        `${message.selection.count ?? 1} ${(message.selection.count ?? 1) === 1 ? "question" : "questions"}`}
                    </span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-medium text-foreground">
                    {message.selection.question}
                  </div>
                </div>
                {(message.selection.answer || message.content) && (
                  <div className="px-4 py-2.5 text-sm font-normal text-foreground flex items-center justify-between">
                    <span className="truncate">{message.selection.answer || message.content}</span>
                  </div>
                )}
              </div>
            ) : (
              message.content && (
                <MessageContent variant="contained" className="max-w-full">{message.content}</MessageContent>
              )
            )}
          </div>
        </div>
      </Message>
    )
  }
)

UserMessage.displayName = "UserMessage"
