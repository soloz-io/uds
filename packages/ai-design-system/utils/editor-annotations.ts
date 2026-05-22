/**
 * Editor Annotation Utilities
 * 
 * Functions for applying annotations to Tiptap editor
 */

import type { Editor } from '@tiptap/core'
import type { Annotation } from '@/types/ai-editor'

/**
 * Apply annotations to the editor by setting marks and nodes
 * 
 * @param editor - Tiptap editor instance
 * @param annotations - Array of annotations to apply
 * @param selectedAnnotationId - ID of currently selected annotation
 * @param hoveredAnnotationId - ID of currently hovered annotation
 */
export function applyAnnotationsToEditor(
  editor: Editor | null,
  annotations: Annotation[],
  selectedAnnotationId?: string,
  hoveredAnnotationId?: string | null
): void {
  if (!editor) return

  // Clear existing annotation marks first
  editor.chain().focus().unsetMark('comment').unsetMark('suggestionInsert').unsetMark('suggestionDelete').unsetMark('suggestionModify').run()

  // Apply each annotation
  annotations.forEach((annotation) => {
    const { range, id } = annotation
    const isActive = id === selectedAnnotationId
    const isHover = id === hoveredAnnotationId

    try {
      if (annotation.type === 'comment') {
        // Apply comment mark
        editor
          .chain()
          .focus()
          .setTextSelection({ from: range.from, to: range.to })
          .setMark('comment', {
            commentId: id,
            isActive,
            isHover,
          })
          .run()
      } else if (annotation.type === 'suggestion') {
        const { action } = annotation.data

        if (action === 'insert') {
          // Apply insert mark
          editor
            .chain()
            .focus()
            .setTextSelection({ from: range.from, to: range.to })
            .setMark('suggestionInsert', {
              suggestionId: id,
              isActive,
              isHover,
            })
            .run()
        } else if (action === 'delete') {
          // Apply delete mark
          editor
            .chain()
            .focus()
            .setTextSelection({ from: range.from, to: range.to })
            .setMark('suggestionDelete', {
              suggestionId: id,
              isActive,
              isHover,
            })
            .run()
        } else if (action === 'modify') {
          // Apply modify mark
          editor
            .chain()
            .focus()
            .setTextSelection({ from: range.from, to: range.to })
            .setMark('suggestionModify', {
              suggestionId: id,
              isActive,
              isHover,
            })
            .run()
        }
      }
      // Note: Block additions are handled differently - they're part of the document structure
      // and should be in the content JSONContent, not applied as marks
    } catch (error) {
      console.error('Error applying annotation:', annotation, error)
    }
  })

  // Reset selection to end of document
  editor.commands.blur()
}

/**
 * Calculate position for CommentBox near an annotation or selection
 * 
 * @param editor - Tiptap editor instance
 * @param from - Starting position
 * @returns Position coordinates { x, y }
 */
export function calculateCommentBoxPosition(
  editor: Editor,
  from: number
): { x: number; y: number } {
  try {
    const coords = editor.view.coordsAtPos(from)
    
    return {
      x: coords.right + 10, // 10px to the right of selection
      y: coords.top,
    }
  } catch (error) {
    console.error('Error calculating comment box position:', error)
    return { x: 0, y: 0 }
  }
}
