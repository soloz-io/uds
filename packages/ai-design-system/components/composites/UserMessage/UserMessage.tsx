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

/**
 * UserMessage Block
 *
 * A simple block component for displaying user messages.
 * Uses Message AI element with right-alignment.
 */

export interface UserMessageData {
  id: string
  content: string
  avatarSrc?: string
  avatarName?: string
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
        <MessageContent variant="contained">{message.content}</MessageContent>
      </Message>
    )
  }
)

UserMessage.displayName = "UserMessage"
