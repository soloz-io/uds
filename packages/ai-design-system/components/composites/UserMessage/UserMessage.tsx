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
import { cn } from "@/lib/utils"

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
}

function UserMessageAttachments({ attachments }: { attachments: UserMessageAttachment[] }) {
  const images = attachments.filter((a) => a.mime.startsWith("image/"))
  if (images.length === 0) return null

  return (
    <div className="flex flex-wrap justify-end gap-2">
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
            {message.content && (
              <MessageContent variant="contained" className="max-w-full">{message.content}</MessageContent>
            )}
          </div>
        </div>
      </Message>
    )
  }
)

UserMessage.displayName = "UserMessage"
