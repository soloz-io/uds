/**
 * DocumentEditor Block
 * 
 * Tiptap-based read-only editor with annotation overlays
 * Block layer: uses primitives and Tiptap extensions only
 */

import React, { useEffect } from 'react'
import './DocumentEditor.css'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { Markdown } from '@tiptap/markdown'
import { cn } from '@/lib/utils'
import {
  CommentMark,
  PendingCommentMark,
  SuggestionInsertMark,
  SuggestionDeleteMark,
  SuggestionModifyMark,
  BlockAdditionNode,
} from '@/extensions/tiptap'
import { applyAnnotationsToEditor } from '@/utils/editor-annotations'
import type { DocumentEditorProps } from '@/types/ai-editor'

export const DocumentEditor = React.memo<DocumentEditorProps>(
  ({
    content,
    format = 'json',
    annotations,
    selectedAnnotationId,
    hoveredAnnotationId,
    pendingCommentRange,
    onTextSelect,
    onAnnotationClick,
    onAnnotationHover,
    readOnly = true,
    className,
  }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Highlight,
        Markdown,
        CommentMark,
        PendingCommentMark,
        SuggestionInsertMark,
        SuggestionDeleteMark,
        SuggestionModifyMark,
        BlockAdditionNode,
      ],
      content,
      // Tell Tiptap what format the initial content is in
      contentType: format === 'markdown' ? 'markdown' : 'json',
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: cn(
            'prose max-w-none focus:outline-none',
            'min-h-[200px] p-4',
            className
          ),
        },
      },
    })

    // Update content when it changes
    useEffect(() => {
      if (editor && content) {
        // Handle markdown format
        if (format === 'markdown' && typeof content === 'string') {
          // Use contentType option to tell Tiptap to parse as markdown
          editor.commands.setContent(content, { contentType: 'markdown' })
        } 
        // Handle JSON format
        else {
          const currentContent = editor.getJSON()
          if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
            editor.commands.setContent(content)
          }
        }
      }
    }, [editor, content, format])

    // Apply annotations when they change
    useEffect(() => {
      if (editor) {
        applyAnnotationsToEditor(editor, annotations, selectedAnnotationId, hoveredAnnotationId)
      }
    }, [editor, annotations, selectedAnnotationId, hoveredAnnotationId])

    // Apply pending comment highlight (yellow) when user selects text
    useEffect(() => {
      if (!editor) return

      if (pendingCommentRange) {
        const { from, to } = pendingCommentRange
        
        // Apply pending comment mark to show yellow highlight
        // Use transaction to avoid triggering selection events
        const { state, view } = editor
        const tr = state.tr
        tr.addMark(from, to, state.schema.marks.pendingComment.create({ pending: true }))
        view.dispatch(tr)
      } else {
        // Clear all pending comment marks
        const { state, view } = editor
        const tr = state.tr
        
        state.doc.descendants((node, pos) => {
          node.marks.forEach((mark) => {
            if (mark.type.name === 'pendingComment') {
              tr.removeMark(pos, pos + node.nodeSize, mark.type)
            }
          })
        })
        
        if (tr.docChanged) {
          view.dispatch(tr)
        }
      }
    }, [editor, pendingCommentRange])

    // Handle text selection events - trigger on mouseup (selection complete)
    useEffect(() => {
      if (!editor || !onTextSelect) return

      const handleMouseUp = (event: MouseEvent) => {
        // Check if the click was on an existing annotation
        // If so, skip text selection handling (annotation click handler will handle it)
        const target = event.target as HTMLElement
        const annotationEl = target.closest(
          '[data-comment-id], [data-suggestion-id], [data-addition-id]'
        )
        
        if (annotationEl) {
          // This is a click on an existing annotation, not a text selection
          // The annotation click handler will handle this
          return
        }
        
        // Small delay to ensure selection is finalized
        setTimeout(() => {
          const { from, to, empty } = editor.state.selection
          if (!empty) {
            let text = editor.state.doc.textBetween(from, to)
            let adjustedFrom = from
            let adjustedTo = to
            
            // Trim leading whitespace and adjust range
            const leadingWhitespace = text.match(/^\s+/)
            if (leadingWhitespace) {
              adjustedFrom += leadingWhitespace[0].length
              text = text.trimStart()
            }
            
            // Trim trailing whitespace and adjust range
            const trailingWhitespace = text.match(/\s+$/)
            if (trailingWhitespace) {
              adjustedTo -= trailingWhitespace[0].length
              text = text.trimEnd()
            }
            
            // Skip if only whitespace was selected
            if (!text.trim()) return
            
            // Log selected text for API usage
            console.log('Selected text:', text)
            console.log('Selection range:', { from: adjustedFrom, to: adjustedTo })
            
            // Calculate position for CommentBox based on selection
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0)
              const rect = range.getBoundingClientRect()
              const position = {
                x: rect.left,
                y: rect.bottom + 8, // 8px below selection
              }
              
              // Clear the browser selection
              selection.removeAllRanges()
              
              onTextSelect({ from: adjustedFrom, to: adjustedTo }, text, position)
            } else {
              onTextSelect({ from: adjustedFrom, to: adjustedTo }, text)
            }
          }
        }, 10)
      }

      const editorElement = editor.view.dom
      editorElement.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        editorElement.removeEventListener('mouseup', handleMouseUp)
      }
    }, [editor, onTextSelect])

    // Handle annotation click events
    useEffect(() => {
      if (!editor || !onAnnotationClick) return

      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const annotationEl = target.closest(
          '[data-comment-id], [data-suggestion-id], [data-addition-id]'
        )
        
        if (annotationEl) {
          const id =
            annotationEl.getAttribute('data-comment-id') ||
            annotationEl.getAttribute('data-suggestion-id') ||
            annotationEl.getAttribute('data-addition-id')
          
          if (id) {
            // Calculate position based on the clicked element
            // Position below the annotation, similar to Google Docs
            const rect = annotationEl.getBoundingClientRect()
            const position = {
              x: rect.left, // Align with left edge of annotation
              y: rect.bottom + 8, // 8px below the annotation
            }
            onAnnotationClick(id, position)
          }
        }
      }

      const editorElement = editor.view.dom
      editorElement.addEventListener('click', handleClick)
      
      return () => {
        editorElement.removeEventListener('click', handleClick)
      }
    }, [editor, onAnnotationClick])

    // Handle annotation hover events
    useEffect(() => {
      if (!editor || !onAnnotationHover) return

      const handleMouseOver = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const annotationEl = target.closest(
          '[data-comment-id], [data-suggestion-id], [data-addition-id]'
        )
        
        if (annotationEl) {
          const id =
            annotationEl.getAttribute('data-comment-id') ||
            annotationEl.getAttribute('data-suggestion-id') ||
            annotationEl.getAttribute('data-addition-id')
          
          if (id) {
            onAnnotationHover(id)
          }
        } else {
          onAnnotationHover(null)
        }
      }

      const editorElement = editor.view.dom
      editorElement.addEventListener('mouseover', handleMouseOver)
      
      return () => {
        editorElement.removeEventListener('mouseover', handleMouseOver)
      }
    }, [editor, onAnnotationHover])

    if (!editor) {
      return null
    }

    return (
      <div className={cn('document-editor-wrapper', className)}>
        <EditorContent editor={editor} />
      </div>
    )
  }
)

DocumentEditor.displayName = 'DocumentEditor'
