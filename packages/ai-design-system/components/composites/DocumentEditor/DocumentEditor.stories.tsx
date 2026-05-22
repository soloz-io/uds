/**
 * DocumentEditor Stories
 * 
 * Demonstrates the DocumentEditor component with various annotation types
 */

import type { Meta, StoryObj } from '@storybook/react'
import type { JSONContent } from '@tiptap/core'
import { DocumentEditor } from './DocumentEditor'
import type { DocumentEditorProps, Annotation } from '@/types/ai-editor'

const meta: Meta<typeof DocumentEditor> = {
  title: 'Composites/DocumentEditor',
  component: DocumentEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DocumentEditor>

// Sample document content
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

// Sample annotations
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

const suggestionAnnotations: Annotation[] = [
  {
    type: 'suggestion',
    id: 'suggestion-1',
    range: { from: 100, to: 120 },
    createdAt: Date.now(),
    userId: 'ai-1',
    data: {
      action: 'modify',
      oldText: 'some has suggestions',
      newText: 'others have AI suggestions',
      reason: 'More descriptive wording',
      thread: [],
    },
  },
  {
    type: 'suggestion',
    id: 'suggestion-2',
    range: { from: 150, to: 170 },
    createdAt: Date.now(),
    userId: 'ai-1',
    data: {
      action: 'delete',
      oldText: 'block additions',
      reason: 'Redundant information',
      thread: [],
    },
  },
]

const blockAdditionAnnotations: Annotation[] = [
  {
    type: 'block-addition',
    id: 'addition-1',
    range: { from: 200, to: 200 },
    createdAt: Date.now(),
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
                text: 'This is a new paragraph suggested by AI to improve the document structure.',
              },
            ],
          },
        ],
      },
      reason: 'Adding context for better understanding',
      thread: [],
    },
  },
]

const mixedAnnotations: Annotation[] = [
  ...commentAnnotations,
  ...suggestionAnnotations,
  ...blockAdditionAnnotations,
]

/**
 * Default story with no annotations
 */
export const Default: Story = {
  args: {
    content: sampleContent,
    format: 'json', // Explicit JSON format (default)
    annotations: [],
    readOnly: true,
  },
}

/**
 * Story with comment highlights
 */
export const WithComments: Story = {
  args: {
    content: sampleContent,
    annotations: commentAnnotations,
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked annotation:', id),
  },
}

/**
 * Story with suggestion highlights
 */
export const WithSuggestions: Story = {
  args: {
    content: sampleContent,
    annotations: suggestionAnnotations,
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked annotation:', id),
  },
}

/**
 * Story with block additions
 */
export const WithBlockAdditions: Story = {
  args: {
    content: sampleContent,
    annotations: blockAdditionAnnotations,
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked annotation:', id),
  },
}

/**
 * Story with multiple annotation types
 */
export const WithMultipleAnnotations: Story = {
  args: {
    content: sampleContent,
    annotations: mixedAnnotations,
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked annotation:', id),
    onAnnotationHover: (id) => console.log('Hovered annotation:', id),
    onTextSelect: (range, text) => console.log('Selected text:', text, 'at range:', range),
  },
}

/**
 * Story with selected annotation (active state)
 */
export const WithSelectedAnnotation: Story = {
  args: {
    content: sampleContent,
    annotations: mixedAnnotations,
    selectedAnnotationId: 'comment-1',
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked annotation:', id),
  },
}

/**
 * Story in editable mode (not read-only)
 */
export const EditableMode: Story = {
  args: {
    content: sampleContent,
    annotations: commentAnnotations,
    readOnly: false,
    onTextSelect: (range, text) => console.log('Selected text:', text, 'at range:', range),
  },
}

/**
 * Rich Text Showcase - Demonstrates all supported rich text formatting
 * 
 * This story showcases all Tiptap StarterKit features supported by DocumentEditor:
 * - Text formatting: Bold, Italic, Strike, Code
 * - Headings: H1, H2, H3, H4, H5, H6
 * - Lists: Bullet lists, Ordered lists
 * - Blocks: Blockquote, Code block, Horizontal rule
 * - Paragraph: Regular paragraphs with hard breaks
 * 
 * Note: DocumentEditor uses Tiptap in headless mode (EditorContent only)
 * All formatting is rendered via Tiptap's JSONContent structure
 */
export const RichTextShowcase: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        // Title
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Welcome to DocumentEditor ✨' }],
        },
        
        // Intro callout
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '📘 Did you know?', marks: [{ type: 'bold' }] },
                { type: 'hardBreak' },
                { type: 'text', text: 'This editor is powered by open-source Tiptap in headless mode. All rich text features are rendered using Tiptap StarterKit extensions with custom annotation support.' },
              ],
            },
          ],
        },
        
        // Section: Headings
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Headings' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Six levels of headings are supported:' }],
        },
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Heading 1 - Main Title' }],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Heading 2 - Section Title' }],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Heading 3 - Subsection' }],
        },
        {
          type: 'heading',
          attrs: { level: 4 },
          content: [{ type: 'text', text: 'Heading 4 - Minor Heading' }],
        },
        {
          type: 'heading',
          attrs: { level: 5 },
          content: [{ type: 'text', text: 'Heading 5 - Small Heading' }],
        },
        {
          type: 'heading',
          attrs: { level: 6 },
          content: [{ type: 'text', text: 'Heading 6 - Smallest Heading' }],
        },
        
        // Horizontal rule
        { type: 'horizontalRule' },
        
        // Section: Text Formatting
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Text Formatting' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Try some formatting:' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Make text ' },
                    { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ' to emphasize' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Use ' },
                    { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
                    { type: 'text', text: ' for subtle emphasis' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Add ' },
                    { type: 'text', text: 'strikethrough', marks: [{ type: 'strike' }] },
                    { type: 'text', text: ' for deletions' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Highlight ' },
                    { type: 'text', text: 'inline code', marks: [{ type: 'code' }] },
                    { type: 'text', text: ' snippets' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Use ' },
                    { type: 'text', text: 'highlight', marks: [{ type: 'highlight' }] },
                    { type: 'text', text: ' to draw attention' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Add ' },
                    { 
                      type: 'text', 
                      text: 'links', 
                      marks: [{ type: 'link', attrs: { href: 'https://tiptap.dev' } }] 
                    },
                    { type: 'text', text: ' to external resources' },
                  ],
                },
              ],
            },
          ],
        },
        
        // Combined formatting example
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'You can also combine formats like ' },
            { 
              type: 'text', 
              text: 'bold italic', 
              marks: [{ type: 'bold' }, { type: 'italic' }] 
            },
            { type: 'text', text: ' or ' },
            { 
              type: 'text', 
              text: 'bold strikethrough', 
              marks: [{ type: 'bold' }, { type: 'strike' }] 
            },
            { type: 'text', text: '.' },
          ],
        },
        
        { type: 'horizontalRule' },
        
        // Section: Lists
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Lists' }],
        },
        
        // Bullet list
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Bullet lists for unordered items:' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'First bullet point' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Second bullet point with ' }, { type: 'text', text: 'bold text', marks: [{ type: 'bold' }] }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Third bullet point with nested items:' }],
                },
                // Nested list
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: 'Nested bullet point' }],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: 'Another nested point' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        
        // Ordered list
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Numbered lists for ordered items:' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'First numbered item' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Second numbered item' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Third numbered item' }],
                },
              ],
            },
          ],
        },
        
        { type: 'horizontalRule' },
        
        // Section: Code
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Code' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Use ' },
            { type: 'text', text: 'inline code', marks: [{ type: 'code' }] },
            { type: 'text', text: ' for short snippets or commands like ' },
            { type: 'text', text: 'npm install', marks: [{ type: 'code' }] },
            { type: 'text', text: '.' },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'For longer code, use code blocks:' }],
        },
        {
          type: 'codeBlock',
          content: [
            {
              type: 'text',
              text: 'function example() {\n  const message = "This is a code block";\n  return message;\n}',
            },
          ],
        },
        
        { type: 'horizontalRule' },
        
        // Section: Quotes
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Blockquotes' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Use blockquotes for callouts or quotations:' }],
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '💡 Pro tip:', marks: [{ type: 'bold' }] },
                { type: 'hardBreak' },
                { type: 'text', text: 'Blockquotes can contain ' },
                { type: 'text', text: 'formatted text', marks: [{ type: 'italic' }] },
                { type: 'text', text: ' and are great for highlighting important information or quotes.' },
              ],
            },
          ],
        },
        
        { type: 'horizontalRule' },
        
        // Section: Summary
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Summary' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'All the formatting above is rendered using ' },
            { type: 'text', text: 'Tiptap StarterKit', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' extensions in ' },
            { type: 'text', text: 'headless mode', marks: [{ type: 'code' }] },
            { type: 'text', text: '. The DocumentEditor component provides a clean, read-only view perfect for document review and annotation.' },
          ],
        },
      ],
    },
    annotations: [],
    readOnly: true,
  },
}

/**
 * Diff Display - Shows text modifications with insertions, deletions, and modifications
 * This story demonstrates the diff display capabilities similar to DiffDisplay block
 */
export const DiffDisplay: Story = {
  args: {
    content: {
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
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This paragraph shows a ' },
            { type: 'text', text: 'modification example' },
            { type: 'text', text: ' where text is replaced.' },
          ],
        },
      ],
    },
    annotations: [
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
      {
        type: 'suggestion',
        id: 'diff-modify',
        range: { from: 192, to: 212 }, // "modification example"
        createdAt: Date.now(),
        userId: 'ai-1',
        data: {
          action: 'modify',
          oldText: 'modification example',
          newText: 'replacement example',
          reason: 'More precise wording',
          thread: [],
        },
      },
    ],
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked diff annotation:', id),
  },
}

/**
 * Markdown String Input - Demonstrates passing markdown strings directly
 * 
 * This story shows how to use the DocumentEditor with markdown format.
 * When format="markdown", you can pass plain markdown strings (like LLM responses)
 * without manual JSON conversion. The Tiptap Markdown extension automatically parses
 * and renders the markdown.
 * 
 * Perfect for: LLM-generated content, markdown files, user input
 */
export const MarkdownStringInput: Story = {
  args: {
    content: `# Markdown String Input Demo

This content is passed as a **plain markdown string** - no JSON conversion needed!

## Why Use Markdown Format?

When working with LLMs or markdown content, you can pass strings directly:

- ✅ **No manual parsing** - Just pass the string
- ✅ **LLM-friendly** - Most LLMs output markdown
- ✅ **Simple API** - Set \`format="markdown"\` and you're done

## Supported Markdown Features

### Text Formatting

Make text **bold**, *italic*, or ~~strikethrough~~. Use \`inline code\` for technical terms.

### Lists

Unordered lists:
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered lists:
1. Step one
2. Step two
3. Step three

### Code Blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines and contain **formatted text**.

### Headings

# H1 - Main Title
## H2 - Section
### H3 - Subsection
#### H4 - Minor Heading
##### H5 - Small Heading
###### H6 - Smallest Heading

---

## Example: LLM Response

Imagine an LLM returns this markdown string:

\`\`\`markdown
## Analysis Results

The code review identified **3 issues**:

1. Missing error handling in \`fetchData()\`
2. Unused variable \`tempResult\`
3. Consider using \`async/await\` instead of promises

*Recommendation:* Refactor the data fetching logic.
\`\`\`

You can pass it directly to DocumentEditor without any parsing!

---

**Note:** This entire story content is a single markdown string passed to the \`content\` prop.`,
    format: 'markdown',
    annotations: [],
    readOnly: true,
  },
}

/**
 * Markdown With Annotations - Shows markdown format working with comments, suggestions, and diffs
 * 
 * This story demonstrates that markdown format works seamlessly with all annotation features:
 * - Comments on markdown text
 * - Suggestions (insert, delete, modify)
 * - Block additions
 * 
 * The annotations use character positions that work with the parsed markdown content.
 */
export const MarkdownWithAnnotations: Story = {
  args: {
    content: `# Document Review with Markdown

This document demonstrates how **markdown format** works with annotations.

## Section with Comments

This paragraph has a comment annotation. You can click on the highlighted text to see the comment thread.

## Section with Suggestions

The AI suggests some improvements to this text. You'll see deletions in red and insertions in green.

## Code Example

\`\`\`javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
\`\`\`

The code above can be optimized for better performance.

---

**Markdown + Annotations = Perfect for AI Document Review!**`,
    format: 'markdown',
    annotations: [
      // Comment annotation
      {
        type: 'comment',
        id: 'md-comment-1',
        range: { from: 120, to: 160 },
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
                    content: [{ type: 'text', text: 'This is great! Markdown format makes it so easy to work with LLM outputs.' }],
                  },
                ],
              },
              timestamp: Date.now(),
            },
          ],
        },
      },
      // Suggestion - delete
      {
        type: 'suggestion',
        id: 'md-suggestion-1',
        range: { from: 250, to: 270 },
        createdAt: Date.now(),
        userId: 'ai-1',
        data: {
          action: 'delete',
          oldText: 'some improvements to',
          reason: 'More concise wording',
          thread: [],
        },
      },
      // Suggestion - insert
      {
        type: 'suggestion',
        id: 'md-suggestion-2',
        range: { from: 271, to: 271 },
        createdAt: Date.now(),
        userId: 'ai-1',
        data: {
          action: 'insert',
          newText: 'better ',
          reason: 'Clearer language',
          thread: [],
        },
      },
      // Suggestion - modify
      {
        type: 'suggestion',
        id: 'md-suggestion-3',
        range: { from: 400, to: 420 },
        createdAt: Date.now(),
        userId: 'ai-1',
        data: {
          action: 'modify',
          oldText: 'can be optimized',
          newText: 'could use memoization',
          reason: 'More specific suggestion',
          thread: [],
        },
      },
    ],
    readOnly: true,
    onAnnotationClick: (id) => console.log('Clicked annotation:', id),
    onAnnotationHover: (id) => console.log('Hovered annotation:', id),
  },
}
