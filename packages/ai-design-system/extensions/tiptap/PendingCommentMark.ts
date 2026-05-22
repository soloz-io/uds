/**
 * PendingCommentMark Tiptap Extension
 * 
 * Renders pending comment selection (before comment is added) with yellow highlight
 * This is separate from CommentMark to avoid conflicts with applyAnnotationsToEditor
 */

import { Mark, mergeAttributes } from '@tiptap/core'

export const PendingCommentMark = Mark.create({
  name: 'pendingComment',

  addAttributes() {
    return {
      pending: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-pending-comment="true"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'mark',
      mergeAttributes(HTMLAttributes, {
        'data-pending-comment': 'true',
      }),
      0,
    ]
  },
})
