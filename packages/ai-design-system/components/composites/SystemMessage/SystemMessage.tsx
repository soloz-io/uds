import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/primitives/Icon"

/**
 * SystemMessage composite
 *
 * Renders system-level notifications (e.g., background job completions).
 * Distinct from user/orchestrator messages: centered, muted styling, no avatar.
 */

export interface SystemMessageData {
  id: string
  content: string
  avatarName?: string
}

export interface SystemMessageProps {
  message: SystemMessageData
  /**
   * Custom renderer for system message content.
   * If provided, the content is passed through this renderer
   * (e.g., to detect media types and render audio players).
   */
  renderContent?: (content: string) => React.ReactNode
  /**
   * Where the notice came from. A background notice is the system's; a "user"
   * notice is a request the user sent that the app shows as a notice rather than
   * a chat bubble — marked so the two are never confused.
   */
  origin?: "system" | "user"
}

/**
 * Renders the player/viewer for a known url + mediaType (video, audio,
 * image), or null when the pair matches none of them. Shared by
 * SystemMessage (job notifications) and UserMessage (chat attachments) so
 * in-chat media rendering lives in one place — an audio voice note gets the
 * same `<audio controls>` player wherever it appears.
 */
export function renderMediaOutput(
  url: string,
  mediaType?: string,
  title?: string
): React.ReactNode {
  if (mediaType?.startsWith('audio/')) {
    return (
      <div className="flex flex-col items-start gap-2 w-full max-w-[360px]">
        {title && <span className="text-xs text-muted-foreground break-words">{title}</span>}
        <audio controls className="w-full max-w-full h-8">
          <source src={url} type={mediaType} />
          Your browser does not support the audio element.
        </audio>
      </div>
    )
  }
  if (mediaType?.startsWith('video/')) {
    return (
      <div className="flex flex-col items-start gap-2 w-full max-w-[360px]">
        {title && <span className="text-xs text-muted-foreground break-words">{title}</span>}
        <video controls playsInline className="w-full max-w-full rounded-lg shadow-sm">
          <source src={url} type={mediaType} />
          Your browser does not support the video element.
        </video>
      </div>
    )
  }
  if (mediaType?.startsWith('image/')) {
    return (
      <div className="flex flex-col items-start gap-2 w-full max-w-[360px]">
        {title && <span className="text-xs text-muted-foreground break-words">{title}</span>}
        <img src={url} alt={title || 'Image output'} className="w-full max-w-full rounded-lg object-contain shadow-sm" />
      </div>
    )
  }
  return null
}

function parseSystemMessageContent(content: string): React.ReactNode {
  try {
    const parsed = JSON.parse(content)
    if (parsed && typeof parsed === 'object') {
      const url = typeof parsed.url === 'string' ? parsed.url : undefined
      const mediaType = typeof parsed.mediaType === 'string' ? parsed.mediaType : typeof parsed.type === 'string' ? parsed.type : undefined
      const title = typeof parsed.title === 'string' ? parsed.title : typeof parsed.message === 'string' ? parsed.message : undefined

      if (url) {
        const media = renderMediaOutput(url, mediaType, title)
        if (media) return media
      }
      if (title) return <span>{title}</span>
    }
  } catch {
    // Plain text content
  }
  return <span>{content}</span>
}

export const SystemMessage = React.memo<SystemMessageProps>(
  ({ message, renderContent, origin = "system" }) => {
    if (!message.content || !message.content.trim()) {
      return null;
    }

    const contentNode = renderContent ? renderContent(message.content) : parseSystemMessageContent(message.content);
    if (!contentNode) {
      return null;
    }

    return (
      <div className="flex w-full justify-center py-3">
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl px-4 py-3",
            "bg-muted/80 text-foreground text-sm",
            "max-w-[85%] w-fit overflow-hidden",
            origin === "user" ? "items-start border border-primary/25" : "items-start"
          )}
          data-origin={origin}
        >
          {origin === "user" && (
            <span
              className="flex items-center gap-1 text-xs font-medium text-primary"
              data-testid="system-message-origin-user"
            >
              <Icon name="user" size="xs" aria-hidden="true" />
              Your request
            </span>
          )}
          {contentNode}
        </div>
      </div>
    )
  }
)

SystemMessage.displayName = "SystemMessage"
