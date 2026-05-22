/**
 * CommentBox Block
 * 
 * Floating inline panel that appears for viewing/adding comments
 * Integrates comment thread display and reply functionality
 * Block layer: uses primitives and AI elements only
 */

import React from 'react'
import type { JSONContent } from '@tiptap/react'

/**
 * Extract plain text from Tiptap JSONContent
 */
function extractTextFromJSONContent(content: JSONContent): string {
  if (!content) return ''
  
  let text = ''
  
  // Add text from current node
  if (content.text) {
    text += content.text
  }
  
  // Recursively extract text from child nodes
  if (content.content && Array.isArray(content.content)) {
    for (const child of content.content) {
      const childText = extractTextFromJSONContent(child)
      // Add space between block-level elements
      if (childText && text && content.type !== 'text') {
        text += ' '
      }
      text += childText
    }
  }
  
  return text
}
import {
  Popover,
  PopoverContent,
  Card,
  Badge,
} from '@/components/primitives'
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message'
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupButton,
} from '@/components/primitives/InputGroup'
import { Send } from 'lucide-react'
import { formatCommentDate } from '@/utils/ai-editor'
import type { CommentBoxProps, Comment } from '@/types/ai-editor'
import { cn } from '@/lib/utils'

/**
 * Internal component for rendering comment thread
 */
const CommentThreadDisplay = React.memo<{
  comments: Comment[]
  currentUserId: string
  onReply?: (commentId: string, content: string) => void
}>(({ comments, currentUserId, onReply }) => {
  return (
    <Conversation className="flex-none">
      <ConversationContent className="p-0 space-y-3">
        {comments.map((comment) => (
          <Message
            key={comment.id}
            from={comment.userId === currentUserId ? 'user' : 'assistant'}
            className="!bg-transparent !mx-0 !px-0"
          >
            <MessageAvatar
              src={comment.avatarSrc || '/default-avatar.png'}
              name={comment.userName}
            />
            <MessageContent variant="flat" className="!bg-transparent !px-0 !py-0">
              <div className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground",
                comment.userId === currentUserId && "flex-row-reverse"
              )}>
                <span className="font-medium text-foreground">
                  {comment.userName}
                </span>
                <span>{formatCommentDate(comment.timestamp)}</span>
                {comment.isEdited && <span className="italic">(edited)</span>}
              </div>
              <div className="text-sm">
                {typeof comment.contentRich === 'string'
                  ? comment.contentRich
                  : extractTextFromJSONContent(comment.contentRich)}
              </div>
            </MessageContent>
          </Message>
        ))}

        <InputGroup className="w-full">
          <InputGroupTextarea
            placeholder="Reply..."
            className="min-h-[40px] max-h-[200px] py-2 resize-none min-w-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                const value = e.currentTarget.value
                if (value.trim() && comments.length > 0 && onReply) {
                  onReply(comments[0].id, value)
                  e.currentTarget.value = ''
                }
              }
            }}
          />
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              const textarea = e.currentTarget.parentElement?.querySelector('textarea')
              if (textarea) {
                const value = textarea.value
                if (value.trim() && comments.length > 0 && onReply) {
                  onReply(comments[0].id, value)
                  textarea.value = ''
                }
              }
            }}
          >
            <Send className="h-4 w-4" />
          </InputGroupButton>
        </InputGroup>
      </ConversationContent>
    </Conversation>
  )
})

CommentThreadDisplay.displayName = 'CommentThreadDisplay'

export const CommentBox = React.memo<CommentBoxProps>(
  ({
    annotation,
    position,
    visible,
    currentUserId,
    onClose,
    onCommentAdd,
    onCommentReply,
  }) => {
    if (!visible) return null

    const handleInputSubmit = (textareaElement: HTMLTextAreaElement) => {
      const value = textareaElement.value
      if (!value.trim()) return

      // Convert string to JSONContent format
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: value }],
          },
        ],
      }

      if (!annotation) {
        // New comment
        onCommentAdd?.(content)
        onClose?.()
      } else {
        // Reply to existing annotation
        onCommentReply?.(annotation.id, content)
        textareaElement.value = ''
      }
    }

    const renderContent = () => {
      // New comment (no annotation)
      if (!annotation) {
        return (
          <div className="p-4">
            <InputGroup className="w-full">
              <InputGroupTextarea
                placeholder="Add a comment..."
                autoFocus
                className="min-h-[40px] max-h-[200px] py-2 resize-none min-w-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleInputSubmit(e.currentTarget)
                  }
                }}
              />
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  const textarea = e.currentTarget.parentElement?.querySelector('textarea')
                  if (textarea) {
                    handleInputSubmit(textarea)
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </InputGroupButton>
            </InputGroup>
          </div>
        )
      }

      // Existing comment annotation
      if (annotation.type === 'comment') {
        return (
          <div className="p-4">
            <CommentThreadDisplay
              comments={annotation.data.thread}
              currentUserId={currentUserId}
              onReply={(_, content) => {
                // Convert string to JSONContent format
                const jsonContent = {
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: content }],
                    },
                  ],
                }
                onCommentReply?.(annotation.id, jsonContent)
              }}
            />
          </div>
        )
      }

      // Suggestion annotation (no diff display, just reason and comments)
      if (annotation.type === 'suggestion') {
        const { action } = annotation.data
        const badgeConfig = {
          insert: { label: 'Added', className: 'bg-green-500' },
          delete: { label: 'Removed', className: 'bg-red-500' },
          modify: { label: 'Modified', className: 'bg-yellow-500' },
        }
        const badge = badgeConfig[action]

        return (
          <div className="flex flex-col gap-1 p-1">
            <div className="flex items-center gap-2">
              {badge && (
                <Badge variant="default" className={badge.className}>
                  {badge.label}
                </Badge>
              )}
              {annotation.data.reason && (
                <span className="text-sm text-muted-foreground">
                  {annotation.data.reason}
                </span>
              )}
            </div>
            {annotation.data.thread.length > 0 && (
              <>
                <div className="h-px bg-border" />
                <CommentThreadDisplay
                  comments={annotation.data.thread}
                  currentUserId={currentUserId}
                  onReply={(_, content) => {
                    // Convert string to JSONContent format
                    const jsonContent = {
                      type: 'doc',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: content }],
                        },
                      ],
                    }
                    onCommentReply?.(annotation.id, jsonContent)
                  }}
                />
              </>
            )}
          </div>
        )
      }

      // Block addition annotation
      if (annotation.type === 'block-addition') {
        return (
          <div className="flex flex-col gap-1 p-1">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                Added
              </Badge>
              {annotation.data.reason && (
                <span className="text-sm text-muted-foreground">
                  {annotation.data.reason}
                </span>
              )}
            </div>
            {annotation.data.thread.length > 0 && (
              <>
                <div className="h-px bg-border" />
                <CommentThreadDisplay
                  comments={annotation.data.thread}
                  currentUserId={currentUserId}
                  onReply={(_, content) => {
                    // Convert string to JSONContent format
                    const jsonContent = {
                      type: 'doc',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: content }],
                        },
                      ],
                    }
                    onCommentReply?.(annotation.id, jsonContent)
                  }}
                />
              </>
            )}
          </div>
        )
      }

      return null
    }

    return (
      <Popover open={visible} modal={false}>
        <PopoverContent
          className="w-[400px] p-0"
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
          }}
          side="right"
          align="start"
          onEscapeKeyDown={onClose}
          onPointerDownOutside={(e) => {
            // Only close if clicking outside the popover AND outside any annotation
            const target = e.target as HTMLElement
            const isAnnotation = target.closest('[data-comment-id], [data-suggestion-id], [data-addition-id]')
            if (!isAnnotation) {
              onClose?.()
            }
          }}
        >
          <Card className="border-0 shadow-none p-0">{renderContent()}</Card>
        </PopoverContent>
      </Popover>
    )
  }
)

CommentBox.displayName = 'CommentBox'
