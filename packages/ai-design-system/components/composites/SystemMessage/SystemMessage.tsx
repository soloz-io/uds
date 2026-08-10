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

export const SystemMessage = React.memo<SystemMessageProps>(
  ({ message, renderContent }) => {
    if (!message.content || !message.content.trim()) {
      return null;
    }

    const contentNode = renderContent ? renderContent(message.content) : <span>{message.content}</span>;
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
