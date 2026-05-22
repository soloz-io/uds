/**
 * CommentMark Tiptap Extension
 * 
 * Renders comment annotations as inline marks with hover and active states
 */

import { Mark, mergeAttributes } from '@tiptap/core'

export interface CommentMarkAttributes {
  commentId: string
  isActive?: boolean
  isHover?: boolean
}

export const CommentMark = Mark.create({
  name: 'comment',

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-comment-id'),
        renderHTML: (attributes) => {
          if (!attributes.commentId) {
            return {}
          }
          return {
            'data-comment-id': attributes.commentId,
          }
        },
      },
      isActive: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-active') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.isActive) {
            return {}
          }
          return {
            'data-active': 'true',
          }
        },
      },
      isHover: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-hover') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.isHover) {
            return {}
          }
          return {
            'data-hover': 'true',
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-annotation-type="comment"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'mark',
      mergeAttributes(HTMLAttributes, {
        'data-annotation-type': 'comment',
      }),
      0,
    ]
  },
})
