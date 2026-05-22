/**
 * AI Editor Types
 * 
 * Central export point for all AI Editor type definitions
 */

// Annotation types
export type {
  Annotation,
  CommentAnnotation,
  SuggestionAnnotation,
  BlockAdditionAnnotation,
  Comment,
  User,
  Range,
} from './annotations'

// Component prop types
export type {
  DocumentEditorProps,
  CommentBoxProps,
  CommentThreadProps,
  CommentInputProps,
  DiffDisplayProps,
  AIDocReviewerProps,
} from './editor'
