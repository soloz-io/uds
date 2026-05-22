/**
 * CommentBox Stories
 * 
 * Demonstrates the CommentBox component with various annotation types
 */

import type { Meta, StoryObj } from '@storybook/react'
import type { JSONContent } from '@tiptap/core'
import { CommentBox } from './CommentBox'
import type { CommentBoxProps, Annotation } from '@/types/ai-editor'

const meta: Meta<typeof CommentBox> = {
  title: 'Composites/CommentBox',
  component: CommentBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CommentBox>

// Sample comment annotation
const commentAnnotation: Annotation = {
  type: 'comment',
  id: 'comment-1',
  range: { from: 0, to: 10 },
  createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
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
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
      },
      {
        id: 'thread-2',
        userId: 'user-2',
        userName: 'Jane Smith',
        contentRich: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'I agree, let me add more details.' }],
            },
          ],
        },
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
      },
    ],
  },
}

// Sample suggestion annotation
const suggestionAnnotation: Annotation = {
  type: 'suggestion',
  id: 'suggestion-1',
  range: { from: 0, to: 20 },
  createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
  userId: 'ai-1',
  data: {
    action: 'modify',
    oldText: 'some has suggestions',
    newText: 'others have AI suggestions',
    reason: 'More descriptive wording',
    thread: [
      {
        id: 'thread-3',
        userId: 'user-1',
        userName: 'John Doe',
        contentRich: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Good suggestion!' }],
            },
          ],
        },
        timestamp: Date.now() - 15 * 60 * 1000,
      },
    ],
  },
}

// Sample block addition annotation
const blockAdditionAnnotation: Annotation = {
  type: 'block-addition',
  id: 'addition-1',
  range: { from: 0, to: 0 },
  createdAt: Date.now() - 10 * 60 * 1000, // 10 minutes ago
  userId: 'ai-1',
  data: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a new paragraph suggested by AI.',
            },
          ],
        },
      ],
    },
    reason: 'Adding context for better understanding',
    thread: [],
  },
}

/**
 * New comment box (no annotation)
 */
export const NewComment: Story = {
  args: {
    annotation: undefined,
    position: { x: 100, y: 100 },
    visible: true,
    currentUserId: 'user-1',
    onClose: () => console.log('Close'),
    onCommentAdd: (content) => console.log('Add comment:', content),
  },
}

/**
 * Existing comment with thread
 */
export const ExistingComment: Story = {
  args: {
    annotation: commentAnnotation,
    position: { x: 100, y: 100 },
    visible: true,
    currentUserId: 'user-1',
    onClose: () => console.log('Close'),
    onCommentReply: (id, content) => console.log('Reply to:', id, content),
  },
}

/**
 * Suggestion with diff display
 */
export const SuggestionWithDiff: Story = {
  args: {
    annotation: suggestionAnnotation,
    position: { x: 100, y: 100 },
    visible: true,
    currentUserId: 'user-1',
    onClose: () => console.log('Close'),
    onCommentReply: (id, content) => console.log('Reply to:', id, content),
  },
}

/**
 * Block addition
 */
export const BlockAddition: Story = {
  args: {
    annotation: blockAdditionAnnotation,
    position: { x: 100, y: 100 },
    visible: true,
    currentUserId: 'user-1',
    onClose: () => console.log('Close'),
    onCommentReply: (id, content) => console.log('Reply to:', id, content),
  },
}

/**
 * Hidden state
 */
export const Hidden: Story = {
  args: {
    annotation: commentAnnotation,
    position: { x: 100, y: 100 },
    visible: false,
    currentUserId: 'user-1',
  },
}
