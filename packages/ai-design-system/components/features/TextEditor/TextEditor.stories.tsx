/**
 * TextEditor Feature Stories
 * 
 * Required story patterns for TextEditor feature:
 * - Default: Static single-document mode (backward compatible)
 * - Empty: Empty state for multi-tab mode
 * - WithStateManagement: Interactive multi-tab with mock hook
 */

import type { Meta, StoryObj } from '@storybook/react'
import { TextEditor } from './TextEditor'
import { useTextEditorMock } from './useTextEditor.mock'
import {
  sampleContent,
  currentUser,
  sampleAnnotations,
  sampleMultiTabDocuments,
} from './TextEditor.mocks'

const meta = {
  title: 'Features/TextEditor',
  component: TextEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextEditor>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default - Static single-document mode (REQUIRED)
 * 
 * Shows the editor in the original single-document usage pattern with
 * existing annotations. Demonstrates backward compatibility with existing
 * consumers who have not yet migrated to multi-tab mode.
 */
export const Default: Story = {
  args: {
    content: sampleContent,
    annotations: sampleAnnotations,
    currentUser,
    mode: 'review',
    onAnnotationAdd: (annotation) => console.log('Added annotation:', annotation),
    onAnnotationUpdate: (annotation) => console.log('Updated annotation:', annotation),
  },
}

/**
 * Empty - Multi-tab empty state (REQUIRED edge case)
 * 
 * Shows the empty state when no documents are open in multi-tab mode.
 * Demonstrates edge case behavior and placeholder messaging.
 */
export const Empty: Story = {
  args: {
    documents: [],
    currentUser,
    mode: 'review',
  },
}

/**
 * WithStateManagement - Multi-tab interactive mode (REQUIRED)
 * 
 * Demonstrates the new multi-tab capability with live state management.
 * Users can switch tabs, close tabs, and manage annotations across
 * multiple documents. Uses mock hook for realistic interaction simulation.
 */
export const WithStateManagement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multi-tab interactive mode with full state management. On desktop (>= 768px), displays a split view with the file explorer and document editor. On mobile (< 768px), the editor pane takes 100% width, and the file explorer is opened via a mobile Drawer triggered from the tab bar or files button.',
      },
    },
  },
  render: () => {
    const mockState = useTextEditorMock({
      multiDoc: true,
      initialDocuments: sampleMultiTabDocuments,
    })

    return (
      <TextEditor
        documents={mockState.documents}
        activeDocumentId={mockState.activeDocumentId}
        fileTree={mockState.fileTree}
        currentUser={currentUser}
        mode="review"
        onTabSelect={mockState.switchDocument}
        onTabClose={mockState.closeDocument}
        onAnnotationAdd={mockState.addAnnotation}
        onAnnotationUpdate={mockState.updateAnnotation}
      />
    )
  },
}
