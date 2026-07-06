/**
 * AI Editor Component Types
 * 
 * Defines prop interfaces and event handlers for editor components
 */

import type { JSONContent } from '@tiptap/core'
import type { Annotation, Comment, User, Range } from './annotations'

/**
 * Props for the DocumentEditor component
 */
export interface DocumentEditorProps {
  /** 
   * Document content - can be either:
   * - JSONContent: Tiptap's JSON format (default)
   * - string: Markdown string (when format='markdown')
   * 
   * @example
   * // JSON format (default)
   * content={{ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] }}
   * 
   * @example
   * // Markdown format
   * content="## Heading\n\nThis is **bold** text"
   * format="markdown"
   */
  content: JSONContent | string
  /** 
   * Content format - determines how content prop is interpreted
   * - 'json': Content is Tiptap JSONContent (default)
   * - 'markdown': Content is a markdown string
   * 
   * @default 'json'
   */
  format?: 'json' | 'markdown' | string
  /** Array of annotations to display */
  annotations: Annotation[]
  /** ID of currently selected annotation */
  selectedAnnotationId?: string
  /** ID of currently hovered annotation */
  hoveredAnnotationId?: string | null
  /** Range for pending comment (shows yellow highlight) */
  pendingCommentRange?: Range
  /** Callback when text is selected - includes calculated position for CommentBox */
  onTextSelect?: (range: Range, text: string, position?: { x: number; y: number }) => void
  /** Callback when annotation is clicked - includes calculated position for CommentBox */
  onAnnotationClick?: (annotationId: string, position: { x: number; y: number }) => void
  /** Callback when annotation is hovered */
  onAnnotationHover?: (annotationId: string | null) => void
  /** Whether editor is read-only */
  readOnly?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Props for the CommentBox component
 */
export interface CommentBoxProps {
  /** Annotation to display (undefined for new comment) */
  annotation?: Annotation
  /** Position coordinates for the floating box */
  position: { x: number; y: number }
  /** Whether the box is visible */
  visible: boolean
  /** Current user information */
  currentUserId: string
  /** Callback when box should close */
  onClose?: () => void
  /** Callback when new comment is added */
  onCommentAdd?: (content: JSONContent) => void
  /** Callback when reply is added to existing comment */
  onCommentReply?: (annotationId: string, content: JSONContent) => void
}

/**
 * Props for the CommentThread component
 */
export interface CommentThreadProps {
  /** Array of comments to display */
  comments: Comment[]
  /** Current user ID for ownership checks */
  currentUserId: string
  /** Callback when reply is submitted */
  onReply?: (commentId: string, content: JSONContent) => void
  /** Whether thread is collapsed */
  collapsed?: boolean
}

/**
 * Props for the CommentInput component
 */
export interface CommentInputProps {
  /** Placeholder text */
  placeholder?: string
  /** Whether to auto-focus on mount */
  autoFocus?: boolean
  /** Default content value */
  defaultValue?: JSONContent
  /** Callback when comment is submitted */
  onSubmit: (content: JSONContent) => void
  /** Callback when input is cancelled */
  onCancel?: () => void
}

/**
 * Props for the DiffDisplay component
 */
export interface DiffDisplayProps {
  /** Original text (for deletions/modifications) */
  oldText?: string
  /** New text (for insertions/modifications) */
  newText?: string
  /** Display mode */
  mode?: 'inline' | 'split'
  /** Additional CSS classes */
  className?: string
}

/**
 * Props for the AIDocReviewer feature component
 */
export interface AIDocReviewerProps {
  // Content (controlled)
  /** Document content in Tiptap JSONContent format */
  content: JSONContent
  /** Array of annotations */
  annotations: Annotation[]
  /** ID of currently selected annotation */
  selectedAnnotationId?: string

  // Events
  /** Callback when content is updated */
  onContentUpdate?: (content: JSONContent) => void
  /** Callback when annotation is clicked */
  onAnnotationClick?: (annotation: Annotation) => void
  /** Callback when annotation is hovered */
  onAnnotationHover?: (annotation: Annotation | null) => void
  /** Callback when text is selected */
  onTextSelect?: (range: Range, selectedText: string) => void
  /** Callback when new annotation is added */
  onAnnotationAdd?: (annotation: Annotation) => void
  /** Callback when annotation is updated */
  onAnnotationUpdate?: (annotation: Annotation) => void
  /** Callback when annotation is deleted */
  onAnnotationDelete?: (annotationId: string) => void

  // Config
  /** Current user information */
  currentUser: User
  /** Editor mode */
  mode: 'review' | 'readonly'
  /** Additional CSS classes */
  className?: string
}

/**
 * Document metadata for multi-tab editor
 */
export interface DocumentFile {
  /** Unique document identifier */
  id: string
  /** Human-readable document name */
  name: string
  /** Whether document has unsaved changes */
  isDirty: boolean
  /** Content format */
  format?: 'json' | 'markdown' | string
  /** Last modified timestamp */
  lastModified: number
}

/**
 * Document with its content and annotations
 */
export interface DocumentWithAnnotations {
  /** Document metadata */
  file: DocumentFile
  /** Document content in Tiptap JSONContent format or markdown */
  content: JSONContent | string
  /** Array of annotations for this document */
  annotations: Annotation[]
}

/**
 * Tab metadata for multi-tab editor
 */
export interface TabMetadata {
  /** Document ID this tab represents */
  documentId: string
  /** Whether the tab is currently active */
  isActive: boolean
  /** Whether the document has unsaved changes */
  isDirty: boolean
  /** Last time this tab was viewed */
  lastViewedAt: number
}
