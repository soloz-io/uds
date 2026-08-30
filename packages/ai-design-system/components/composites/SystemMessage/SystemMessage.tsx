import * as React from "react"
import { cn } from "@/lib/utils"

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
}

function parseSystemMessageContent(content: string): React.ReactNode {
  try {
    const parsed = JSON.parse(content)
    if (parsed && typeof parsed === 'object') {
      const url = typeof parsed.url === 'string' ? parsed.url : undefined
      const mediaType = typeof parsed.mediaType === 'string' ? parsed.mediaType : typeof parsed.type === 'string' ? parsed.type : undefined
      const title = typeof parsed.title === 'string' ? parsed.title : typeof parsed.message === 'string' ? parsed.message : undefined

      if (url) {
        if (mediaType?.startsWith('video/') || /\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
          return (
            <div className="flex flex-col items-center gap-2">
              {title && <span className="text-xs text-muted-foreground">{title}</span>}
              <video controls className="w-full max-w-[360px] rounded-md shadow-sm">
                <source src={url} type={mediaType || 'video/mp4'} />
                Your browser does not support the video element.
              </video>
            </div>
          )
        }
        if (mediaType?.startsWith('audio/') || /\.(wav|mp3|ogg|m4a)(\?.*)?$/i.test(url)) {
          return (
            <div className="flex flex-col items-center gap-2">
              {title && <span className="text-xs text-muted-foreground">{title}</span>}
              <audio controls className="w-full max-w-[360px] h-8">
                <source src={url} type={mediaType || 'audio/wav'} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )
        }
        if (mediaType?.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(url)) {
          return (
            <div className="flex flex-col items-center gap-2">
              {title && <span className="text-xs text-muted-foreground">{title}</span>}
              <img src={url} alt={title || 'Image output'} className="max-w-[360px] rounded-md shadow-sm" />
            </div>
          )
        }
      }
      if (title) return <span>{title}</span>
    }
  } catch {
    // Plain text content
  }
  return <span>{content}</span>
}

export const SystemMessage = React.memo<SystemMessageProps>(
  ({ message, renderContent }) => {
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
            "flex items-center gap-2 rounded-lg px-4 py-2.5",
            "bg-muted/60 text-muted-foreground text-sm",
            "max-w-[85%]"
          )}
        >
          {contentNode}
        </div>
      </div>
    )
  }
)

SystemMessage.displayName = "SystemMessage"
