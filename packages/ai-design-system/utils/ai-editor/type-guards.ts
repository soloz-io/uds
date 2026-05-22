/**
 * Type Guards for AI Editor Annotations
 * 
 * Provides runtime type checking for discriminated union types
 */

import type {
  Annotation,
  CommentAnnotation,
  SuggestionAnnotation,
  BlockAdditionAnnotation,
} from '../../types/ai-editor'

/**
 * Type guard to check if annotation is a CommentAnnotation
 * 
 * @param annotation - Annotation to check
 * @returns True if annotation is a CommentAnnotation
 * 
 * @example
 * ```ts
 * if (isCommentAnnotation(annotation)) {
 *   // TypeScript knows annotation.data.thread exists
 *   console.log(annotation.data.thread.length)
 * }
 * ```
 */
export function isCommentAnnotation(
  annotation: Annotation
): annotation is CommentAnnotation {
  return annotation.type === 'comment'
}

/**
 * Type guard to check if annotation is a SuggestionAnnotation
 * 
 * @param annotation - Annotation to check
 * @returns True if annotation is a SuggestionAnnotation
 * 
 * @example
 * ```ts
 * if (isSuggestionAnnotation(annotation)) {
 *   // TypeScript knows annotation.data.action exists
 *   console.log(annotation.data.action)
 * }
 * ```
 */
export function isSuggestionAnnotation(
  annotation: Annotation
): annotation is SuggestionAnnotation {
  return annotation.type === 'suggestion'
}

/**
 * Type guard to check if annotation is a BlockAdditionAnnotation
 * 
 * @param annotation - Annotation to check
 * @returns True if annotation is a BlockAdditionAnnotation
 * 
 * @example
 * ```ts
 * if (isBlockAdditionAnnotation(annotation)) {
 *   // TypeScript knows annotation.data.content exists
 *   console.log(annotation.data.content)
 * }
 * ```
 */
export function isBlockAdditionAnnotation(
  annotation: Annotation
): annotation is BlockAdditionAnnotation {
  return annotation.type === 'block-addition'
}
