/**
 * DocumentEditorWithComments Stories
 * 
 * Demonstrates the DocumentEditorWithComments section with various annotation types
 */

import type { Meta, StoryObj } from '@storybook/react'
import type { JSONContent } from '@tiptap/core'
import { DocumentEditorWithComments } from './DocumentEditorWithComments'
import type { Annotation } from '@/types/ai-editor'

const meta: Meta<typeof DocumentEditorWithComments> = {
  title: 'Blocks/DocumentEditorWithComments',
  component: DocumentEditorWithComments,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DocumentEditorWithComments>

// Use the SAME document for all stories (like DocumentEditor block does)
const sampleContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Document Review Example' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is a sample document with various annotations. ' },
        { type: 'text', text: 'Some text has comments, ' },
        { type: 'text', text: 'some has suggestions, ' },
        { type: 'text', text: 'and some has block additions.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'The editor supports inline annotations for comments and suggestions. ' },
        { type: 'text', text: 'Click on any highlighted text to see the annotation details.' },
      ],
    },
  ],
}

// Annotations calculated for the sampleContent document
const commentAnnotations: Annotation[] = [
  {
    type: 'comment',
    id: 'comment-1',
    range: { from: 50, to: 70 },
    createdAt: Date.now(),
    userId: 'user-1',
    data: {
      thread: [
        {
          id: 'thread-1',
          userId: 'user-1',
          userName: 'John Doe',
          contentRich: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This section needs clarification.' }],
              },
            ],
          },
          timestamp: Date.now(),
        },
      ],
    },
  },
]

// Document specifically for suggestions demo
const suggestionsContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Text Modification Examples' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This paragraph shows a ' },
        { type: 'text', text: 'deletion example' },
        { type: 'text', text: ' with strikethrough text.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This paragraph shows an ' },
        { type: 'text', text: 'insertion example' },
        { type: 'text', text: ' with green highlighted text.' },
      ],
    },
  ],
}

const suggestionAnnotations: Annotation[] = [
  {
    type: 'suggestion',
    id: 'diff-delete',
    range: { from: 60, to: 76 }, // "deletion example"
    createdAt: Date.now(),
    userId: 'ai-1',
    data: {
      action: 'delete',
      oldText: 'deletion example',
      reason: 'Remove redundant text',
      thread: [],
    },
  },
  {
    type: 'suggestion',
    id: 'diff-insert',
    range: { from: 125, to: 142 }, // "insertion example"
    createdAt: Date.now(),
    userId: 'ai-1',
    data: {
      action: 'insert',
      newText: 'insertion example',
      reason: 'Add clarifying text',
      thread: [],
    },
  },
]

const mixedAnnotations: Annotation[] = [
  ...commentAnnotations,
  ...suggestionAnnotations,
]

/**
 * Default story with mixed annotations
 */
export const Default: Story = {
  args: {
    content: sampleContent,
    annotations: mixedAnnotations,
    currentUserId: 'user-1',
    currentUserName: 'John Doe',
    readOnly: false,
    onAnnotationAdd: (annotation) => console.log('Added annotation:', annotation),
    onAnnotationUpdate: (annotation) => console.log('Updated annotation:', annotation),
  },
}

/**
 * Story with empty document
 */
export const EmptyDocument: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    annotations: [],
    currentUserId: 'user-1',
    currentUserName: 'John Doe',
    readOnly: false,
  },
}

/**
 * Story in readonly mode (no interactions)
 */
export const ReadonlyMode: Story = {
  args: {
    content: sampleContent,
    annotations: commentAnnotations,
    currentUserId: 'user-1',
    currentUserName: 'John Doe',
    readOnly: true,
  },
}

/**
 * Story with only comment annotations
 */
export const CommentsOnly: Story = {
  args: {
    content: sampleContent,
    annotations: commentAnnotations,
    currentUserId: 'user-1',
    currentUserName: 'John Doe',
    readOnly: false,
    onAnnotationAdd: (annotation) => console.log('Added annotation:', annotation),
    onAnnotationUpdate: (annotation) => console.log('Updated annotation:', annotation),
  },
}

/**
 * Story with only suggestion annotations
 * Shows deletion (red strikethrough) and insertion (green highlight)
 */
export const SuggestionsOnly: Story = {
  args: {
    content: suggestionsContent,
    annotations: suggestionAnnotations,
    currentUserId: 'user-1',
    currentUserName: 'John Doe',
    readOnly: false,
    onAnnotationAdd: (annotation) => console.log('Added annotation:', annotation),
    onAnnotationUpdate: (annotation) => console.log('Updated annotation:', annotation),
  },
}


/**
 * Story with both comments and suggestions
 * Shows yellow comment highlights and green/red suggestion highlights together
 */
export const CommentsAndSuggestions: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Document with Comments and Suggestions' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This paragraph has a comment annotation. ' },
            { type: 'text', text: 'Click the highlighted text to view the discussion.' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This paragraph shows a ' },
            { type: 'text', text: 'deletion suggestion' },
            { type: 'text', text: ' with red strikethrough.' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This paragraph shows an ' },
            { type: 'text', text: 'insertion suggestion' },
            { type: 'text', text: ' with green highlight.' },
          ],
        },
      ],
    },
    annotations: [
      {
        type: 'comment',
        id: 'comment-1',
        range: { from: 62, to: 80 }, // "comment annotation"
        createdAt: Date.now(),
        userId: 'user-1',
        data: {
          thread: [
            {
              id: 'thread-1',
              userId: 'user-1',
              userName: 'John Doe',
              avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
              contentRich: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'This section needs clarification.' }],
                  },
                ],
              },
              timestamp: Date.now() - 3600000,
            },
            {
              id: 'thread-2',
              userId: 'user-2',
              userName: 'Jane Smith',
              avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
              contentRich: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'I agree, let me add more details.' }],
                  },
                ],
              },
              timestamp: Date.now() - 1800000,
            },
          ],
        },
      },
      {
        type: 'suggestion',
        id: 'suggestion-delete',
        range: { from: 157, to: 176 }, // "deletion suggestion"
        createdAt: Date.now(),
        userId: 'ai-1',
        data: {
          action: 'delete',
          oldText: 'deletion suggestion',
          reason: 'Remove redundant text',
          thread: [],
        },
      },
      {
        type: 'suggestion',
        id: 'suggestion-insert',
        range: { from: 226, to: 246 }, // "insertion suggestion"
        createdAt: Date.now(),
        userId: 'ai-1',
        data: {
          action: 'insert',
          newText: 'insertion suggestion',
          reason: 'Add clarifying text',
          thread: [],
        },
      },
    ],
    currentUserId: 'user-1',
    currentUserName: 'John Doe',
    readOnly: false,
    onAnnotationAdd: (annotation) => console.log('Added annotation:', annotation),
    onAnnotationUpdate: (annotation) => console.log('Updated annotation:', annotation),
  },
}
