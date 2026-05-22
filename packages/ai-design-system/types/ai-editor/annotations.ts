/**
 * AI Editor Annotation Types
 * 
 * Defines the core data structures for document annotations including
 * comments, suggestions, and block additions.
 */

import type { JSONContent } from '@tiptap/core'

/**
 * Range type representing a text selection in the document
 * Uses Tiptap's position-based format
 */
export interface Range {
  /** Starting character position in document */
  from: number
  /** Ending character position in document */
  to: number
}

/**
 * Comment structure for threaded discussions
 */
export interface Comment {
  /** Unique comment identifier */
  id: string
  /** User ID who created the comment */
  userId: string
  /** Display name of the user */
  userName: string
  /** Optional avatar URL */
  avatarSrc?: string
  /** Rich text content in Tiptap JSONContent format */
  contentRich: JSONContent
  /** Unix timestamp of creation */
  timestamp: number
  /** Parent comment ID for replies (flat structure, one level only) */
  parentId?: string
  /** Whether the comment has been edited */
  isEdited?: boolean
  /** Unix timestamp of last update */
  updatedAt?: number
}

/**
 * User information
 */
export interface User {
  /** Unique user identifier */
  id: string
  /** Display name */
  name: string
  /** Optional avatar URL */
  avatarSrc?: string
}

/**
 * Base annotation interface with common properties
 */
interface BaseAnnotation {
  /** Unique annotation identifier */
  id: string
  /** Text range this annotation applies to */
  range: Range
  /** Unix timestamp of creation */
  createdAt: number
  /** User ID who created the annotation */
  userId: string
}

/**
 * Comment annotation - user-created text selection with discussion thread
 */
export interface CommentAnnotation extends BaseAnnotation {
  type: 'comment'
  data: {
    /** Thread of comments and replies */
    thread: Comment[]
    /** Whether the comment thread is resolved */
    resolved?: boolean
  }
}

/**
 * Suggestion annotation - AI-generated text modification
 */
export interface SuggestionAnnotation extends BaseAnnotation {
  type: 'suggestion'
  data: {
    /** Type of modification */
    action: 'modify' | 'delete' | 'insert'
    /** Original text (undefined for insert) */
    oldText?: string
    /** New text (undefined for delete) */
    newText?: string
    /** Explanation for the suggestion */
    reason: string
    /** Discussion thread about this suggestion */
    thread: Comment[]
  }
}

/**
 * Block addition annotation - AI-generated new paragraph or section
 */
export interface BlockAdditionAnnotation extends BaseAnnotation {
  type: 'block-addition'
  data: {
    /** Content of the new block in Tiptap format */
    content: JSONContent
    /** Explanation for the addition */
    reason: string
    /** Discussion thread about this addition */
    thread: Comment[]
  }
}

/**
 * Union type for all annotation types
 * Uses discriminated union pattern for type safety
 */
export type Annotation =
  | CommentAnnotation
  | SuggestionAnnotation
  | BlockAdditionAnnotation
