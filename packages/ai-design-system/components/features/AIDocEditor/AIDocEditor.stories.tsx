/**
 * AIDocEditor Feature Stories
 * 
 * Required story patterns for AIDocEditor feature:
 * - Default: Static single-document mode (backward compatible)
 * - Empty: Empty state for multi-tab mode
 * - WithStateManagement: Interactive multi-tab with mock hook
 */

import type { Meta, StoryObj } from '@storybook/react'
import { AIDocEditor } from './AIDocEditor'
import { useAIDocEditorMock } from './useAIDocEditor.mock'
import {
  sampleContent,
  currentUser,
  sampleAnnotations,
  sampleMultiTabDocuments,
} from './AIDocEditor.mocks'

const meta = {
  title: 'Features/AIDocEditor',
  component: AIDocEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AIDocEditor>

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
  render: () => {
    const mockState = useAIDocEditorMock({
      multiDoc: true,
      initialDocuments: sampleMultiTabDocuments,
    })

    return (
      <AIDocEditor
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
