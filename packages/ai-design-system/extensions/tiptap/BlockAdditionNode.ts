/**
 * BlockAdditionNode Tiptap Extension
 * 
 * Renders block-level addition annotations with green highlight and badge
 */

import { Node, mergeAttributes } from '@tiptap/core'

export interface BlockAdditionNodeAttributes {
  additionId: string
  reason?: string
  isActive?: boolean
}

export const BlockAdditionNode = Node.create({
  name: 'blockAddition',

  group: 'block',

  content: 'block+',

  addAttributes() {
    return {
      additionId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-addition-id'),
        renderHTML: (attributes) => {
          if (!attributes.additionId) {
            return {}
          }
          return {
            'data-addition-id': attributes.additionId,
          }
        },
      },
      reason: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-reason'),
        renderHTML: (attributes) => {
          if (!attributes.reason) {
            return {}
          }
          return {
            'data-reason': attributes.reason,
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
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-annotation-type="block-addition"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'annotation-block-addition',
        'data-annotation-type': 'block-addition',
      }),
      0,
    ]
  },
})
