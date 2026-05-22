/**
 * AI Editor Utilities
 * 
 * Central export point for all AI Editor utility functions
 */

// Type guards
export {
  isCommentAnnotation,
  isSuggestionAnnotation,
  isBlockAdditionAnnotation,
} from './type-guards'

// Validation utilities
export {
  validateRange,
  validateAnnotation,
  validateAnnotations,
} from './validation'

// Date formatting
export { formatCommentDate } from './format-date'
