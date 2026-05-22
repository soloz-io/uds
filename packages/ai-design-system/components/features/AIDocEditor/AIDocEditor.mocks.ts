/**
 * Mock data for AIDocEditor stories and tests
 * 
 * This file contains reusable mock data that can be imported by:
 * - AIDocEditor.stories.tsx (regular stories)
 * - AIDocEditor.behaviors.stories.tsx (behavior tests)
 * - Any other test files that need AIDocEditor mock data
 */

import type { JSONContent } from '@tiptap/core'
import type { Annotation, User } from '@/types/ai-editor'
import type { DocumentWithAnnotations, DocumentFile } from '@/types/ai-editor'

/**
 * Sample document content for stories and tests
 */
export const sampleContent: JSONContent = {
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

/**
 * Current user for stories and tests
 */
export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
}

/**
 * Sample annotations for stories and tests
 */
export const sampleAnnotations: Annotation[] = [
  {
    type: 'comment',
    id: 'comment-1',
    range: { from: 50, to: 70 },
    createdAt: Date.now() - 3600000,
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
      ],
    },
  },
  {
    type: 'suggestion',
    id: 'suggestion-1',
    range: { from: 80, to: 100 },
    createdAt: Date.now() - 1800000,
    userId: 'ai-1',
    data: {
      action: 'delete',
      oldText: 'some has suggestions',
      reason: 'Remove redundant text',
      thread: [],
    },
  },
]

/**
 * Sample document files for multi-tab stories
 */
export const sampleDocumentFiles: DocumentFile[] = [
  {
    id: 'doc-1',
    name: 'Introduction.md',
    isDirty: false,
    format: 'markdown',
    lastModified: Date.now() - 3600000,
  },
  {
    id: 'doc-2',
    name: 'Workflow.json',
    isDirty: true,
    format: 'json',
    lastModified: Date.now() - 1800000,
  },
  {
    id: 'doc-3',
    name: 'Configuration.md',
    isDirty: false,
    format: 'markdown',
    lastModified: Date.now() - 900000,
  },
]

/**
 * Sample multi-tab documents for stories
 */
export const sampleMultiTabDocuments: DocumentWithAnnotations[] = [
  {
    file: sampleDocumentFiles[0],
    content: sampleContent,
    annotations: sampleAnnotations,
  },
  {
    file: sampleDocumentFiles[1],
    content: sampleContent,
    annotations: [sampleAnnotations[0]],
  },
  {
    file: sampleDocumentFiles[2],
    content: sampleContent,
    annotations: [],
  },
]
