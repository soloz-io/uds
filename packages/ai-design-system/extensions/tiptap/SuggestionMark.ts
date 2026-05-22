/**
 * SuggestionMark Tiptap Extensions
 * 
 * Renders suggestion annotations as inline marks with different styles
 * for insert, delete, and modify actions
 */

import { Mark, mergeAttributes } from '@tiptap/core'

export interface SuggestionMarkAttributes {
  suggestionId: string
  action: 'insert' | 'delete' | 'modify'
  isActive?: boolean
  isHover?: boolean
}

/**
 * SuggestionInsertMark - Green highlight for insertions
 */
export const SuggestionInsertMark = Mark.create({
  name: 'suggestionInsert',

  addAttributes() {
    return {
      suggestionId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggestion-id'),
        renderHTML: (attributes) => {
          if (!attributes.suggestionId) {
            return {}
          }
          return {
            'data-suggestion-id': attributes.suggestionId,
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
        tag: 'ins[data-annotation-type="suggestion-insert"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ins',
      mergeAttributes(HTMLAttributes, {
        class: 'annotation-suggestion-insert',
        'data-annotation-type': 'suggestion-insert',
      }),
      0,
    ]
  },
})

/**
 * SuggestionDeleteMark - Red strikethrough for deletions
 */
export const SuggestionDeleteMark = Mark.create({
  name: 'suggestionDelete',

  addAttributes() {
    return {
      suggestionId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggestion-id'),
        renderHTML: (attributes) => {
          if (!attributes.suggestionId) {
            return {}
          }
          return {
            'data-suggestion-id': attributes.suggestionId,
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
        tag: 'del[data-annotation-type="suggestion-delete"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'del',
      mergeAttributes(HTMLAttributes, {
        class: 'annotation-suggestion-delete',
        'data-annotation-type': 'suggestion-delete',
      }),
      0,
    ]
  },
})

/**
 * SuggestionModifyMark - Combination of delete and insert
 */
export const SuggestionModifyMark = Mark.create({
  name: 'suggestionModify',

  addAttributes() {
    return {
      suggestionId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggestion-id'),
        renderHTML: (attributes) => {
          if (!attributes.suggestionId) {
            return {}
          }
          return {
            'data-suggestion-id': attributes.suggestionId,
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
        tag: 'span[data-annotation-type="suggestion-modify"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'annotation-suggestion-modify',
        'data-annotation-type': 'suggestion-modify',
      }),
      0,
    ]
  },
})
