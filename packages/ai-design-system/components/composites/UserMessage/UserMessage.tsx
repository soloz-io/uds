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
}

/**
 * UserMessage component - displays user messages with right alignment
 */
export const UserMessage = React.memo<UserMessageProps>(
  ({ message, showAvatar = true }) => {
    return (
      <Message from="user">
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
        <div className="flex flex-col items-end gap-2">
          {message.attachments && message.attachments.length > 0 && (
            <UserMessageAttachments attachments={message.attachments} />
          )}
          {message.content && (
            <MessageContent variant="contained">{message.content}</MessageContent>
          )}
        </div>
      </Message>
    )
  }
)

UserMessage.displayName = "UserMessage"
