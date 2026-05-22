/**
 * DocumentEditorWithComments Section
 * 
 * Combines DocumentEditor and CommentBox blocks to provide inline commenting functionality
 * Section layer: composes blocks and manages UI state
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { DocumentEditor } from '@/components/composites/DocumentEditor'
import { CommentBox } from '@/components/composites/CommentBox'
import { Card } from '@/components/primitives/Card'
import type { JSONContent } from '@tiptap/core'
import type { Annotation, CommentAnnotation, Range } from '@/types/ai-editor'

/**
 * Props for DocumentEditorWithComments section
 */
export interface DocumentEditorWithCommentsProps {
  /** 
   * Document content - can be either:
   * - JSONContent: Tiptap's JSON format (default)
   * - string: Markdown string (when format='markdown')
   */
  content: JSONContent | string
  /** 
   * Content format - determines how content prop is interpreted
   * @default 'json'
   */
  format?: 'json' | 'markdown'
  /** Array of annotations to display */
  annotations: Annotation[]
  /** ID of currently selected annotation */
  selectedAnnotationId?: string
  /** Current user ID for comment ownership */
  currentUserId: string
  /** Current user name for new comments and replies */
  currentUserName: string
  /** Whether editor is in read-only mode */
  readOnly?: boolean
  /** Callback when new annotation is added */
  onAnnotationAdd?: (annotation: Annotation) => void
  /** Callback when annotation is updated (e.g., reply added) */
  onAnnotationUpdate?: (annotation: Annotation) => void
  /** Additional CSS classes */
  className?: string
}

export const DocumentEditorWithComments = React.memo<DocumentEditorWithCommentsProps>(
  ({
    content,
    format = 'json',
    annotations,
    selectedAnnotationId,
    currentUserId,
    currentUserName,
    readOnly = false,
    onAnnotationAdd,
    onAnnotationUpdate,
    className,
  }) => {
    // Internal UI state
    const [commentBoxVisible, setCommentBoxVisible] = useState(false)
    const [commentBoxPosition, setCommentBoxPosition] = useState({ x: 0, y: 0 })
    const [activeAnnotation, setActiveAnnotation] = useState<Annotation | undefined>()
    const [selectedRange, setSelectedRange] = useState<Range | undefined>()
    const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null)

    /**
     * Sync activeAnnotation with latest data from annotations array
     * This ensures CommentBox shows updated data when replies are added
     */
    useEffect(() => {
      if (activeAnnotation && commentBoxVisible) {
        const updatedAnnotation = annotations.find((a) => a.id === activeAnnotation.id)
        if (updatedAnnotation) {
          setActiveAnnotation(updatedAnnotation)
        }
      }
    }, [annotations, activeAnnotation, commentBoxVisible])

    /**
     * Handle annotation click - show CommentBox near the annotation
     */
    const handleAnnotationClick = useCallback(
      (annotationId: string, position: { x: number; y: number }) => {
        const annotation = annotations.find((a) => a.id === annotationId)
        if (annotation) {
          setActiveAnnotation(annotation)
          setSelectedRange(undefined)
          setCommentBoxPosition(position)
          setCommentBoxVisible(true)
        }
      },
      [annotations]
    )

    /**
     * Handle text selection - show CommentBox for new comment
     */
    const handleTextSelect = useCallback(
      (range: Range, text: string, position?: { x: number; y: number }) => {
        if (readOnly || !text.trim()) return

        // Show CommentBox for new comment
        setActiveAnnotation(undefined)
        setSelectedRange(range)
        
        // Use calculated position from DocumentEditor, or fallback to default
        const finalPosition = position || { x: 600, y: 100 }
        setCommentBoxPosition(finalPosition)
        setCommentBoxVisible(true)
      },
      [readOnly]
    )

    /**
     * Handle new comment submission
     */
    const handleCommentAdd = useCallback(
      (content: JSONContent) => {
        if (!selectedRange || !onAnnotationAdd) return

        // Create new comment annotation
        const newAnnotation: CommentAnnotation = {
          type: 'comment',
          id: `comment-${Date.now()}`,
          range: selectedRange,
          createdAt: Date.now(),
          userId: currentUserId,
          data: {
            thread: [
              {
                id: `comment-msg-${Date.now()}`,
                userId: currentUserId,
                userName: currentUserName,
                contentRich: content,
                timestamp: Date.now(),
              },
            ],
          },
        }

        onAnnotationAdd(newAnnotation)
        setCommentBoxVisible(false)
        setSelectedRange(undefined)
      },
      [selectedRange, currentUserId, currentUserName, onAnnotationAdd]
    )

    /**
     * Handle reply to existing annotation
     */
    const handleCommentReply = useCallback(
      (annotationId: string, content: JSONContent) => {
        if (!onAnnotationUpdate) return

        const annotation = annotations.find((a) => a.id === annotationId)
        if (!annotation) return

        // Add reply to the annotation's thread
        const newComment = {
          id: `comment-msg-${Date.now()}`,
          userId: currentUserId,
          userName: currentUserName,
          contentRich: content,
          timestamp: Date.now(),
        }

        let updatedAnnotation: Annotation
        
        if (annotation.type === 'comment') {
          updatedAnnotation = {
            ...annotation,
            data: {
              ...annotation.data,
              thread: [...annotation.data.thread, newComment],
            },
          }
        } else if (annotation.type === 'suggestion') {
          updatedAnnotation = {
            ...annotation,
            data: {
              ...annotation.data,
              thread: [...annotation.data.thread, newComment],
            },
          }
        } else {
          updatedAnnotation = {
            ...annotation,
            data: {
              ...annotation.data,
              thread: [...annotation.data.thread, newComment],
            },
          }
        }

        onAnnotationUpdate(updatedAnnotation)
      },
      [annotations, currentUserId, currentUserName, onAnnotationUpdate]
    )

    /**
     * Handle annotation hover - update hover state
     */
    const handleAnnotationHover = useCallback((annotationId: string | null) => {
      setHoveredAnnotationId(annotationId)
    }, [])

    /**
     * Handle CommentBox close - clear pending comment highlight
     */
    const handleCommentBoxClose = useCallback(() => {
      setCommentBoxVisible(false)
      setActiveAnnotation(undefined)
      setSelectedRange(undefined) // This clears the yellow highlight
    }, [])

    // Memoize props to prevent unnecessary re-renders of DocumentEditor
    // This is critical because re-renders trigger setContent() which clears marks
    const documentEditorProps = useMemo(
      () => ({
        content,
        format,
        annotations,
        selectedAnnotationId,
        hoveredAnnotationId,
        pendingCommentRange: selectedRange, // Pass pending range to show yellow highlight
        onTextSelect: handleTextSelect,
        onAnnotationClick: handleAnnotationClick,
        onAnnotationHover: handleAnnotationHover,
        readOnly,
      }),
      [content, format, annotations, selectedAnnotationId, hoveredAnnotationId, selectedRange, handleTextSelect, handleAnnotationClick, handleAnnotationHover, readOnly]
    )

    return (
      <Card className={className}>
        <DocumentEditor {...documentEditorProps} />

        <CommentBox
          annotation={activeAnnotation}
          position={commentBoxPosition}
          visible={commentBoxVisible}
          currentUserId={currentUserId}
          onClose={handleCommentBoxClose}
          onCommentAdd={handleCommentAdd}
          onCommentReply={handleCommentReply}
        />
      </Card>
    )
  }
)

DocumentEditorWithComments.displayName = 'DocumentEditorWithComments'

