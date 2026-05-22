/**
 * Validation Utilities for AI Editor
 * 
 * Provides runtime validation for annotations and ranges
 */

import type { Annotation, Range } from '../../types/ai-editor'
import {
  isCommentAnnotation,
  isSuggestionAnnotation,
  isBlockAdditionAnnotation,
} from './type-guards'

/**
 * Validates a range object
 * 
 * @param range - Range to validate
 * @param documentLength - Total length of the document
 * @returns True if range is valid
 */
export function validateRange(range: Range, documentLength: number): boolean {
  // Check range bounds
  if (range.from < 0 || range.to > documentLength) {
    console.error('Range out of bounds:', range, 'Document length:', documentLength)
    return false
  }

  // Check range order
  if (range.from >= range.to) {
    console.error('Invalid range: from must be less than to:', range)
    return false
  }

  return true
}

/**
 * Validates an annotation object
 * 
 * @param annotation - Annotation to validate
 * @param documentLength - Total length of the document
 * @returns True if annotation is valid
 */
export function validateAnnotation(
  annotation: Annotation,
  documentLength: number
): boolean {
  // Validate range
  if (!validateRange(annotation.range, documentLength)) {
    return false
  }

  // Validate type-specific data
  if (isCommentAnnotation(annotation)) {
    if (!annotation.data.thread || annotation.data.thread.length === 0) {
      console.error('Comment annotation must have at least one comment:', annotation)
      return false
    }
  } else if (isSuggestionAnnotation(annotation)) {
    if (!annotation.data.reason) {
      console.error('Suggestion annotation must have a reason:', annotation)
      return false
    }

    // Validate action-specific requirements
    if (annotation.data.action === 'modify') {
      if (!annotation.data.oldText || !annotation.data.newText) {
        console.error(
          'Modify suggestion must have both oldText and newText:',
          annotation
        )
        return false
      }
    } else if (annotation.data.action === 'delete') {
      if (!annotation.data.oldText) {
        console.error('Delete suggestion must have oldText:', annotation)
        return false
      }
    } else if (annotation.data.action === 'insert') {
      if (!annotation.data.newText) {
        console.error('Insert suggestion must have newText:', annotation)
        return false
      }
    }
  } else if (isBlockAdditionAnnotation(annotation)) {
    if (!annotation.data.content || !annotation.data.reason) {
      console.error('Block addition must have content and reason:', annotation)
      return false
    }
  }

  return true
}

/**
 * Validates an array of annotations
 * 
 * @param annotations - Array of annotations to validate
 * @param documentLength - Total length of the document
 * @returns Object with validation results
 */
export function validateAnnotations(
  annotations: Annotation[],
  documentLength: number
): {
  valid: boolean
  errors: string[]
  validAnnotations: Annotation[]
  invalidAnnotations: Annotation[]
} {
  const errors: string[] = []
  const validAnnotations: Annotation[] = []
  const invalidAnnotations: Annotation[] = []

  for (const annotation of annotations) {
    if (validateAnnotation(annotation, documentLength)) {
      validAnnotations.push(annotation)
    } else {
      invalidAnnotations.push(annotation)
      errors.push(`Invalid annotation: ${annotation.id}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    validAnnotations,
    invalidAnnotations,
  }
}
